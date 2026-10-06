/**
 * src/database.js
 * SQLite helpers and offline fallback dishes for Little Lemon menu data.
 * Compatible with modern expo-sqlite (SDK 57 openDatabaseAsync API).
 */

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'little_lemon.db';
let dbInstance = null;

// Bundled fallback dishes ensuring offline resilience
export const FALLBACK_MENU_ITEMS = [
  {
    name: 'Greek Salad',
    price: 12.99,
    description: 'The famous Greek salad of crispy lettuce, peppers, olives, and authentic feta cheese with garlic dressing.',
    image: 'greekSalad.jpg',
    category: 'starters',
  },
  {
    name: 'Bruschetta',
    price: 7.99,
    description: 'Our classic bruschetta made from grilled artisan bread smeared with garlic and seasoned with salt and olive oil.',
    image: 'bruschetta.jpg',
    category: 'starters',
  },
  {
    name: 'Pita & Hummus',
    price: 8.50,
    description: 'Warm fluffy pita triangles served with homemade chickpea hummus, smoked paprika, and extra virgin olive oil.',
    image: 'pitaHummus.jpg',
    category: 'starters',
  },
  {
    name: 'Grilled Fish',
    price: 20.00,
    description: 'Fresh catch of the day marinated in Mediterranean herbs, garlic, and sea salt, served with chargrilled lemon.',
    image: 'grilledFish.jpg',
    category: 'mains',
  },
  {
    name: 'Pasta',
    price: 18.99,
    description: 'Penne tossed with slow-simmered San Marzano tomato basil marinara, capers, kalamata olives, and parmesan.',
    image: 'pasta.jpg',
    category: 'mains',
  },
  {
    name: 'Lamb Chops',
    price: 24.50,
    description: 'Tender grilled lamb cutlets seasoned with wild oregano, rosemary, garlic, and fresh mint glaze.',
    image: 'lambChops.jpg',
    category: 'mains',
  },
  {
    name: 'Lemon Dessert',
    price: 6.99,
    description: 'Traditional Mediterranean lemon cake topped with homemade vanilla lemon zest custard and powdered sugar.',
    image: 'lemonDessert.jpg',
    category: 'desserts',
  },
  {
    name: 'Baklava',
    price: 7.50,
    description: 'Crispy golden phyllo pastry layered with crushed pistachios, walnuts, and scented spiced honey syrup.',
    image: 'baklava.jpg',
    category: 'desserts',
  },
  {
    name: 'Fresh Lemonade',
    price: 4.50,
    description: 'Freshly squeezed Meyer lemons infused with fresh garden mint leaves and raw cane sugar.',
    image: 'lemonade.jpg',
    category: 'drinks',
  },
  {
    name: 'Mediterranean Iced Tea',
    price: 4.00,
    description: 'Chilled steeped black tea infused with dried orange peel, wild mountain sage, and honey over ice.',
    image: 'icedTea.jpg',
    category: 'drinks',
  },
];

/**
 * Initializes SQLite database and ensures the menu table schema exists.
 */
export async function getDb() {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  await dbInstance.execAsync(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT,
      category TEXT
    );
  `);
  return dbInstance;
}

/**
 * Returns number of stored dishes.
 */
export async function getMenuCount() {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT COUNT(*) as count FROM menu;');
  return row ? row.count : 0;
}

/**
 * Stores a list of menu items into SQLite inside a transaction.
 */
export async function saveMenuItems(items) {
  if (!items || items.length === 0) return;
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM menu;');
    for (const item of items) {
      await db.runAsync(
        'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);',
        [
          item.name,
          Number(item.price) || 0,
          item.description || '',
          item.image || '',
          (item.category || '').toLowerCase(),
        ]
      );
    }
  });
}

/**
 * Queries menu items from SQLite with parameterized search text and category filtering.
 * @param {string} search - debounced search query string
 * @param {string[]} selectedCategories - array of selected category strings
 */
export async function filterMenuItems(search = '', selectedCategories = []) {
  const db = await getDb();
  let sql = 'SELECT * FROM menu';
  const params = [];
  const whereClauses = [];

  const trimmedSearch = (search || '').trim();
  if (trimmedSearch.length > 0) {
    whereClauses.push('LOWER(name) LIKE ?');
    params.push(`%${trimmedSearch.toLowerCase()}%`);
  }

  if (selectedCategories && selectedCategories.length > 0) {
    const placeholders = selectedCategories.map(() => '?').join(', ');
    whereClauses.push(`LOWER(category) IN (${placeholders})`);
    selectedCategories.forEach((cat) => params.push(cat.toLowerCase()));
  }

  if (whereClauses.length > 0) {
    sql += ' WHERE ' + whereClauses.join(' AND ');
  }

  sql += ' ORDER BY id ASC;';

  const rows = await db.getAllAsync(sql, params);
  return rows || [];
}

/**
 * Fetches all distinct categories present in the database.
 */
export async function getDistinctCategories() {
  const db = await getDb();
  const rows = await db.getAllAsync(
    "SELECT DISTINCT category FROM menu WHERE category IS NOT NULL AND category != '' ORDER BY category ASC;"
  );
  return rows.map((r) => r.category);
}

export default {
  getDb,
  getMenuCount,
  saveMenuItems,
  filterMenuItems,
  getDistinctCategories,
  FALLBACK_MENU_ITEMS,
};
