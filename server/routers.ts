import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // APK procedures
  apks: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllAPKs();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAPKById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          status: z.string().min(1),
          size: z.string().min(1),
          downloads: z.number().default(0),
          imageUrl: z.string().url(),
          borderColor: z.string().min(1),
          category: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can create APKs' });
        }
        const apk = await db.createAPK(input);
        await db.createAdminLog({
          action: 'CREATE',
          apkId: apk.id,
          details: `Created APK: ${apk.name}`,
        });
        return apk;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          status: z.string().optional(),
          size: z.string().optional(),
          downloads: z.number().optional(),
          imageUrl: z.string().url().optional(),
          borderColor: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update APKs' });
        }
        const { id, ...updateData } = input;
        const apk = await db.updateAPK(id, updateData);
        await db.createAdminLog({
          action: 'UPDATE',
          apkId: id,
          details: `Updated APK: ${apk.name}`,
        });
        return apk;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can delete APKs' });
        }
        const apk = await db.getAPKById(input.id);
        if (!apk) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'APK not found' });
        }
        await db.deleteAPK(input.id);
        await db.createAdminLog({
          action: 'DELETE',
          apkId: input.id,
          details: `Deleted APK: ${apk.name}`,
        });
        return { success: true };
      }),
  }),

  // Admin procedures
  admin: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const admin = await db.getAdminByUsername(input.username);
        if (!admin || admin.password !== input.password) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }
        // In a real app, you'd set a session here
        return { success: true, admin: { username: admin.username } };
      }),
  }),
});

export type AppRouter = typeof appRouter;
