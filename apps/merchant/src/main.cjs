const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const QRCode = require('qrcode');

let db;
function bootDatabase() {
  db = new Database(path.join(app.getPath('userData'), 'qrprint.db'));
  db.exec(`CREATE TABLE IF NOT EXISTS stores (id INTEGER PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
           CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY, store_id INTEGER, filename TEXT, status TEXT DEFAULT 'paid', collection_code TEXT UNIQUE, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
}
function code() { return Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join(''); }
function createWindow() { const win = new BrowserWindow({ width: 1240, height: 800, minWidth: 960, webPreferences: { preload: path.join(__dirname, 'preload.cjs') } }); win.loadFile(path.join(__dirname, '../renderer/index.html')); }
app.whenReady().then(() => { bootDatabase(); createWindow(); });
ipcMain.handle('stores:list', () => db.prepare('SELECT * FROM stores ORDER BY name').all());
ipcMain.handle('stores:create', async (_, name) => { const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36); const r = db.prepare('INSERT INTO stores (name,slug) VALUES (?,?)').run(name, slug); return { id:r.lastInsertRowid, name, slug, qr: await QRCode.toDataURL(`${process.env.CUSTOMER_URL || 'https://app.qrprint.example'}/s/${slug}`) }; });
ipcMain.handle('jobs:list', () => db.prepare('SELECT jobs.*, stores.name store_name FROM jobs LEFT JOIN stores ON stores.id=jobs.store_id ORDER BY jobs.created_at DESC').all());
ipcMain.handle('jobs:complete', (_, id) => { let c; do c=code(); while(db.prepare('SELECT 1 FROM jobs WHERE collection_code=?').get(c)); db.prepare("UPDATE jobs SET status='ready', collection_code=? WHERE id=?").run(c, id); return c; });
ipcMain.handle('jobs:collect', (_, collectionCode) => {
  const job = db.prepare("SELECT * FROM jobs WHERE collection_code=? AND status='ready'").get(collectionCode.trim().toUpperCase());
  if (!job) return { ok: false, message: 'No ready order matches that code.' };
  db.prepare("UPDATE jobs SET status='collected' WHERE id=?").run(job.id);
  return { ok: true, message: `Order #${job.id} marked collected.` };
});
