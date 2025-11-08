import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Clear existing data
await connection.execute('DELETE FROM apks');
await connection.execute('DELETE FROM adminCredentials');

// Seed APKs
const apksData = [
  {
    name: 'Movie Hub',
    description: 'Premium movie streaming app',
    status: 'Premium Unlocked',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Movie+Hub',
    borderColor: 'blue',
    category: 'Entertainment'
  },
  {
    name: 'Play Store',
    description: 'Google Play Store modded version',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Play+Store',
    borderColor: 'purple',
    category: 'Utilities'
  },
  {
    name: 'Phone Pay',
    description: 'Payment app',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Phone+Pay',
    borderColor: 'purple',
    category: 'Finance'
  },
  {
    name: 'INFINITY REDEEM',
    description: 'Redeem codes generator',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Infinity+Redeem',
    borderColor: 'orange',
    category: 'Utilities'
  },
  {
    name: 'MAXX BOOMBER',
    description: 'Game booster app',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Maxx+Boomber',
    borderColor: 'red',
    category: 'Gaming'
  },
  {
    name: 'Block iseen',
    description: 'Hide seen status',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Block+Iseen',
    borderColor: 'green',
    category: 'Utilities'
  },
  {
    name: 'Gpay',
    description: 'Google Pay modded',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Gpay',
    borderColor: 'blue',
    category: 'Finance'
  },
  {
    name: 'Fampay',
    description: 'Family payment app',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Fampay',
    borderColor: 'orange',
    category: 'Finance'
  },
  {
    name: 'Jalwa Mod',
    description: 'Social media app',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Jalwa+Mod',
    borderColor: 'purple',
    category: 'Social'
  },
  {
    name: 'YouTube Lite',
    description: 'Lightweight YouTube',
    status: 'Premium unlock',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=YouTube+Lite',
    borderColor: 'orange',
    category: 'Entertainment'
  },
  {
    name: 'Inshort Premium',
    description: 'News app premium',
    status: 'Premium unlock',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Inshort+Premium',
    borderColor: 'pink',
    category: 'News'
  },
  {
    name: 'Live Camera',
    description: 'Camera app',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Live+Camera',
    borderColor: 'pink',
    category: 'Photography'
  },
  {
    name: 'Movie Box',
    description: 'Movie streaming',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Movie+Box',
    borderColor: 'blue',
    category: 'Entertainment'
  },
  {
    name: 'Direct Locater',
    description: 'Location tracker',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Direct+Locater',
    borderColor: 'purple',
    category: 'Utilities'
  },
  {
    name: 'Ads Remover',
    description: 'Remove ads from apps',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Ads+Remover',
    borderColor: 'cyan',
    category: 'Utilities'
  },
  {
    name: 'Funsta',
    description: 'Fun stickers app',
    status: 'Free',
    size: '15MB',
    downloads: 1,
    imageUrl: 'https://via.placeholder.com/200?text=Funsta',
    borderColor: 'pink',
    category: 'Entertainment'
  }
];

for (const apk of apksData) {
  await connection.execute(
    'INSERT INTO apks (name, description, status, size, downloads, imageUrl, borderColor, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [apk.name, apk.description, apk.status, apk.size, apk.downloads, apk.imageUrl, apk.borderColor, apk.category]
  );
}

// Seed admin credentials
await connection.execute(
  'INSERT INTO adminCredentials (username, password) VALUES (?, ?)',
  ['admin', 'admin123']
);

console.log('Database seeded successfully!');
await connection.end();
