import { openDatabase, databasePath } from './db.js'
import { activities, campuses, categories, categoryActivityTemplates, photos, places, sources } from './data/seed-data.js'

const db = openDatabase()

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS campuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    summary TEXT NOT NULL,
    color TEXT NOT NULL,
    map_size TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS places (
    id TEXT PRIMARY KEY,
    campus_id TEXT NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    category_id TEXT NOT NULL,
    x REAL NOT NULL,
    y REAL NOT NULL,
    intro TEXT NOT NULL,
    useful_for TEXT NOT NULL,
    facilities TEXT NOT NULL,
    tip TEXT NOT NULL,
    FOREIGN KEY (campus_id) REFERENCES campuses(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    credit TEXT NOT NULL,
    source TEXT DEFAULT '',
    kind TEXT DEFAULT 'photo',
    FOREIGN KEY (place_id) REFERENCES places(id)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id TEXT NOT NULL,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT NOT NULL,
    FOREIGN KEY (place_id) REFERENCES places(id)
  );

  CREATE TABLE IF NOT EXISTS official_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT DEFAULT '',
    unit TEXT DEFAULT '',
    source_url TEXT NOT NULL,
    synced_at TEXT NOT NULL,
    FOREIGN KEY (place_id) REFERENCES places(id)
  );

  CREATE TABLE IF NOT EXISTS category_activity_templates (
    category_id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    url TEXT NOT NULL
  );
`)

db.exec(`
  DELETE FROM sources;
  DELETE FROM official_events;
  DELETE FROM activities;
  DELETE FROM photos;
  DELETE FROM places;
  DELETE FROM category_activity_templates;
  DELETE FROM campuses;
  DELETE FROM categories;
`)

const insertCategory = db.prepare('INSERT INTO categories (id, label) VALUES (?, ?)')
for (const category of categories) {
  insertCategory.run(category.id, category.label)
}

const insertCampus = db.prepare(
  'INSERT INTO campuses (id, name, address, summary, color, map_size) VALUES (?, ?, ?, ?, ?, ?)'
)
for (const campus of campuses) {
  insertCampus.run(campus.id, campus.name, campus.address, campus.summary, campus.color, JSON.stringify(campus.mapSize))
}

const insertTemplate = db.prepare(
  'INSERT INTO category_activity_templates (category_id, status, date, title, detail) VALUES (?, ?, ?, ?, ?)'
)
for (const [categoryId, activity] of Object.entries(categoryActivityTemplates)) {
  insertTemplate.run(categoryId, activity.status, activity.date, activity.title, activity.detail)
}

const insertPlace = db.prepare(`
  INSERT INTO places (
    id, campus_id, name, code, category_id, x, y, intro, useful_for, facilities, tip
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
for (const place of places) {
  insertPlace.run(
    place.id,
    place.campus,
    place.name,
    place.code,
    place.category,
    place.x,
    place.y,
    place.intro,
    JSON.stringify(place.usefulFor),
    JSON.stringify(place.facilities),
    place.tip
  )
}

const insertPhoto = db.prepare(
  'INSERT INTO photos (place_id, image_url, caption, credit, source, kind) VALUES (?, ?, ?, ?, ?, ?)'
)
for (const photo of photos) {
  insertPhoto.run(photo.placeId, photo.imageUrl, photo.caption, photo.credit, photo.source ?? '', photo.kind ?? 'photo')
}

const insertActivity = db.prepare(
  'INSERT INTO activities (place_id, status, date, title, detail) VALUES (?, ?, ?, ?, ?)'
)
for (const activity of activities) {
  insertActivity.run(activity.placeId, activity.status, activity.date, activity.title, activity.detail)
}

const insertSource = db.prepare('INSERT INTO sources (label, url) VALUES (?, ?)')
for (const source of sources) {
  insertSource.run(source.label, source.url)
}

db.close()

console.log(`Seeded SQLite database at ${databasePath}`)
