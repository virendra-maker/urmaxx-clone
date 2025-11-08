# Maxx Apks Hub - Complete Clone

A full-stack clone of the urmaxx.in website built with React, Express, tRPC, and MySQL. Features a public APK marketplace and a hidden admin panel for content management.

## Features

- **Public Frontend**: Beautiful dark-themed APK marketplace with animated background and search functionality
- **Admin Panel**: Hidden admin dashboard accessible via `/admin/login` with full CRUD operations
- **Real-time Search**: Filter APKs by name instantly
- **Responsive Design**: Fully responsive layout matching the original website
- **Database-Driven**: All APK data stored in MySQL database
- **Vercel Ready**: Configured for seamless deployment on Vercel

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Wouter
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL with Drizzle ORM
- **Styling**: Custom CSS with animated particles and gradient backgrounds

## Project Structure

```
urmaxx-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (Home, AdminLogin, AdminDashboard)
│   │   ├── components/    # Reusable components
│   │   ├── styles/        # CSS files
│   │   ├── App.tsx        # Main app with routing
│   │   └── index.css      # Global styles
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database query helpers
│   └── _core/             # Framework internals
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Table definitions
├── seed-db.mjs            # Database seeding script
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/virendra-maker/urmaxx-clone.git
cd urmaxx-clone
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
DATABASE_URL=mysql://user:password@localhost:3306/urmaxx_clone
JWT_SECRET=your_secret_key_here
```

4. Push database schema:
```bash
pnpm db:push
```

5. Seed the database:
```bash
node seed-db.mjs
```

6. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

### Public Website

- Visit `http://localhost:3000` to see the main APK marketplace
- Use the search bar to filter APKs by name
- Click "View Details" on any APK card (currently shows alert)

### Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`

3. In the admin dashboard, you can:
   - **View all APKs** in a table format
   - **Add new APKs** using the "Add New APK" button
   - **Edit existing APKs** by clicking the edit icon
   - **Delete APKs** by clicking the delete icon
   - **Logout** using the logout button in the header

### Admin Features

The admin panel provides full CRUD functionality:
- **Create**: Add new APKs with name, status, size, downloads, image URL, border color, and category
- **Read**: View all APKs in a sortable table
- **Update**: Edit any APK's information
- **Delete**: Remove APKs from the database

## Deployment to Vercel

### Prerequisites

- Vercel account
- GitHub repository with the code pushed

### Steps

1. **Create Vercel Project**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will auto-detect it's a Node.js project

2. **Configure Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `DATABASE_URL`: Your production MySQL connection string
     - `JWT_SECRET`: A secure random string
     - `VITE_APP_TITLE`: "Maxx Apks Hub"
     - Other OAuth and API variables (if using Manus services)

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your project

4. **Run Database Migrations**:
   - After deployment, run migrations on your production database
   - You can use Vercel's CLI or connect to your database directly

5. **Seed Production Database**:
   - Run the seed script on your production database to populate initial APK data

### Production Considerations

- Use a secure, production-grade MySQL database (e.g., AWS RDS, PlanetScale)
- Set strong passwords for admin credentials in production
- Use environment variables for all sensitive data
- Enable HTTPS (Vercel does this automatically)
- Consider implementing rate limiting for the API
- Add proper error logging and monitoring

## API Endpoints

All API calls go through tRPC at `/api/trpc`

### Public Procedures

- `apks.getAll`: Fetch all APKs
- `apks.getById`: Fetch a specific APK by ID

### Protected Procedures (Admin Only)

- `apks.create`: Create a new APK
- `apks.update`: Update an existing APK
- `apks.delete`: Delete an APK
- `admin.login`: Admin login

## Database Schema

### APKs Table
- `id`: Primary key
- `name`: APK name
- `description`: APK description
- `status`: Free/Premium/Premium Unlocked
- `size`: File size (e.g., "15MB")
- `downloads`: Download count
- `imageUrl`: URL to APK image
- `borderColor`: Card border color
- `category`: APK category
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Admin Credentials Table
- `id`: Primary key
- `username`: Admin username
- `password`: Admin password (plaintext in demo, should be hashed in production)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Admin Logs Table
- `id`: Primary key
- `action`: CREATE/UPDATE/DELETE
- `apkId`: Associated APK ID
- `details`: Action details
- `createdAt`: Action timestamp

## Customization

### Changing Colors

Edit the color variables in `client/src/index.css` to customize the theme.

### Changing Admin Credentials

Update the seed script or directly modify the `adminCredentials` table in your database.

### Adding New Fields to APKs

1. Update the schema in `drizzle/schema.ts`
2. Run `pnpm db:push` to migrate
3. Update the form in `AdminDashboard.tsx`
4. Update the tRPC procedures in `server/routers.ts`

## Security Notes

⚠️ **Important**: This is a demo application. For production use:

- Hash admin passwords using bcrypt or similar
- Implement proper JWT-based authentication
- Add CSRF protection
- Validate and sanitize all inputs
- Use HTTPS only
- Implement rate limiting
- Add proper error handling
- Use environment variables for all secrets
- Consider implementing 2FA for admin access

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure MySQL server is running
- Check firewall rules for database access

### Admin Login Not Working

- Verify admin credentials in database
- Check browser console for errors
- Clear localStorage and try again

### APKs Not Displaying

- Run `pnpm db:push` to ensure schema is created
- Run `node seed-db.mjs` to populate data
- Check browser network tab for API errors

## Support

For issues or questions, please create an issue in the GitHub repository.

## License

This project is a clone for educational purposes. Please respect the original website's intellectual property.

## Author

Created by virendra-maker

---

**Note**: This is a full-stack application that requires both frontend and backend to be running. The admin panel is intentionally hidden and only accessible via the `/admin/login` route.
