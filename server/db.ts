import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, apks, InsertAPK, APK, adminCredentials, InsertAdminCredential, adminLogs, InsertAdminLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// APK queries
export async function getAllAPKs(): Promise<APK[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get APKs: database not available");
    return [];
  }

  return await db.select().from(apks);
}

export async function getAPKById(id: number): Promise<APK | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get APK: database not available");
    return undefined;
  }

  const result = await db.select().from(apks).where(eq(apks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAPK(data: InsertAPK): Promise<APK> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(apks).values(data);
  const id = result[0].insertId as number;
  const created = await getAPKById(id);
  if (!created) throw new Error("Failed to create APK");
  return created;
}

export async function updateAPK(id: number, data: Partial<InsertAPK>): Promise<APK> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(apks).set(data).where(eq(apks.id, id));
  const updated = await getAPKById(id);
  if (!updated) throw new Error("Failed to update APK");
  return updated;
}

export async function deleteAPK(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(apks).where(eq(apks.id, id));
}

// Admin credentials queries
export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get admin: database not available");
    return undefined;
  }

  const result = await db.select().from(adminCredentials).where(eq(adminCredentials.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAdminLog(data: InsertAdminLog): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create log: database not available");
    return;
  }

  await db.insert(adminLogs).values(data);
}
