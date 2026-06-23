import express from 'express'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openDatabase, parseJson, databasePath } from './db.js'
import { fetchOfficialEvents, syncOfficialEvents } from './officialEvents.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const port = Number(process.env.PORT ?? 3001)

if (!existsSync(databasePath)) {
  console.error(`SQLite database not found: ${databasePath}`)
  console.error('Run npm run seed before starting the server.')
  process.exit(1)
}

const db = openDatabase()

app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

app.use('/photos', express.static(resolve(__dirname, '..', 'src', 'assets', 'photos')))

function mapCampus(row) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    summary: row.summary,
    color: row.color,
    mapSize: parseJson(row.map_size, { width: 0, height: 0 })
  }
}

function mapActivity(row) {
  if (!row) return undefined

  return {
    status: row.status,
    date: row.date,
    title: row.title,
    detail: row.detail
  }
}

function mapOfficialActivity(row) {
  if (!row?.official_title) return undefined

  return {
    status: '官網活動',
    date: row.official_date,
    title: row.official_title,
    detail: [row.official_location, row.official_unit].filter(Boolean).join('｜') || '同步自逢甲大學官網活動資訊。',
    source: row.official_source_url,
    syncedAt: row.official_synced_at
  }
}

function mapPlace(row) {
  const officialActivity = mapOfficialActivity(row)

  return {
    id: row.id,
    campus: row.campus_id,
    name: row.name,
    code: row.code,
    category: row.category_id,
    x: row.x,
    y: row.y,
    intro: row.intro,
    usefulFor: parseJson(row.useful_for),
    facilities: parseJson(row.facilities),
    tip: row.tip,
    activity:
      officialActivity ??
      mapActivity({
        status: row.activity_status ?? row.template_status,
        date: row.activity_date ?? row.template_date,
        title: row.activity_title ?? row.template_title,
        detail: row.activity_detail ?? row.template_detail
      })
  }
}

function mapPhoto(row) {
  return {
    placeId: row.place_id,
    url: row.image_url,
    caption: row.caption,
    credit: row.credit,
    source: row.source ?? '',
    kind: row.kind ?? 'photo'
  }
}

function mapOfficialEvent(row) {
  return {
    placeId: row.place_id,
    title: row.title,
    date: row.date,
    location: row.location,
    unit: row.unit,
    sourceUrl: row.source_url,
    syncedAt: row.synced_at
  }
}

function officialEventJoinSql() {
  return `
    LEFT JOIN (
      SELECT official_events.*
      FROM official_events
      INNER JOIN (
        SELECT place_id, MIN(id) AS id
        FROM official_events
        GROUP BY place_id
      ) latest_events ON latest_events.id = official_events.id
    ) official_events ON official_events.place_id = places.id
  `
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    database: databasePath
  })
})

app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT id, label FROM categories ORDER BY rowid').all()
  res.json(rows)
})

app.get('/api/campuses', (req, res) => {
  const rows = db.prepare('SELECT * FROM campuses ORDER BY rowid').all()
  res.json(rows.map(mapCampus))
})

app.get('/api/places', (req, res) => {
  const rows = db
    .prepare(
      `
        SELECT
          places.*,
          activities.status AS activity_status,
          activities.date AS activity_date,
          activities.title AS activity_title,
          activities.detail AS activity_detail,
          category_activity_templates.status AS template_status,
          category_activity_templates.date AS template_date,
          category_activity_templates.title AS template_title,
          category_activity_templates.detail AS template_detail,
          official_events.title AS official_title,
          official_events.date AS official_date,
          official_events.location AS official_location,
          official_events.unit AS official_unit,
          official_events.source_url AS official_source_url,
          official_events.synced_at AS official_synced_at
        FROM places
        LEFT JOIN activities ON activities.place_id = places.id
        ${officialEventJoinSql()}
        LEFT JOIN category_activity_templates ON category_activity_templates.category_id = places.category_id
        ORDER BY places.rowid
      `
    )
    .all()

  res.json(rows.map(mapPlace))
})

app.get('/api/places/:id', (req, res) => {
  const row = db
    .prepare(
      `
        SELECT
          places.*,
          activities.status AS activity_status,
          activities.date AS activity_date,
          activities.title AS activity_title,
          activities.detail AS activity_detail,
          category_activity_templates.status AS template_status,
          category_activity_templates.date AS template_date,
          category_activity_templates.title AS template_title,
          category_activity_templates.detail AS template_detail,
          official_events.title AS official_title,
          official_events.date AS official_date,
          official_events.location AS official_location,
          official_events.unit AS official_unit,
          official_events.source_url AS official_source_url,
          official_events.synced_at AS official_synced_at
        FROM places
        LEFT JOIN activities ON activities.place_id = places.id
        ${officialEventJoinSql()}
        LEFT JOIN category_activity_templates ON category_activity_templates.category_id = places.category_id
        WHERE places.id = ?
      `
    )
    .get(req.params.id)

  if (!row) {
    res.status(404).json({ error: 'Place not found' })
    return
  }

  res.json(mapPlace(row))
})

app.get('/api/photos', (req, res) => {
  const rows = db.prepare('SELECT * FROM photos ORDER BY rowid').all()
  res.json(rows.map(mapPhoto))
})

app.get('/api/photos/:placeId', (req, res) => {
  const row = db.prepare('SELECT * FROM photos WHERE place_id = ? ORDER BY rowid LIMIT 1').get(req.params.placeId)

  if (!row) {
    res.status(404).json({ error: 'Photo not found' })
    return
  }

  res.json(mapPhoto(row))
})

app.get('/api/activities', (req, res) => {
  const rows = db.prepare('SELECT place_id AS placeId, status, date, title, detail FROM activities ORDER BY rowid').all()
  res.json(rows)
})

app.get('/api/official-events', async (req, res) => {
  try {
    if (req.query.refresh === '1' || req.query.refresh === 'true') {
      const events = await fetchOfficialEvents()
      syncOfficialEvents(db, events)
    }

    const rows = db.prepare('SELECT * FROM official_events ORDER BY rowid').all()
    res.json(rows.map(mapOfficialEvent))
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch official events',
      message: error.message
    })
  }
})

app.post('/api/sync-official-events', async (req, res) => {
  try {
    const events = await fetchOfficialEvents()
    syncOfficialEvents(db, events)
    res.json({
      synced: events.length,
      events
    })
  } catch (error) {
    res.status(502).json({
      error: 'Failed to sync official events',
      message: error.message
    })
  }
})

app.post('/api/activities', (req, res) => {
  const { placeId, status, date, title, detail } = req.body

  if (!placeId || !status || !date || !title || !detail) {
    res.status(400).json({ error: 'placeId, status, date, title and detail are required' })
    return
  }

  const place = db.prepare('SELECT id FROM places WHERE id = ?').get(placeId)
  if (!place) {
    res.status(404).json({ error: 'Place not found' })
    return
  }

  const result = db
    .prepare('INSERT INTO activities (place_id, status, date, title, detail) VALUES (?, ?, ?, ?, ?)')
    .run(placeId, status, date, title, detail)

  res.status(201).json({
    id: result.lastInsertRowid,
    placeId,
    status,
    date,
    title,
    detail
  })
})

app.get('/api/sources', (req, res) => {
  const rows = db.prepare('SELECT label, url FROM sources ORDER BY rowid').all()
  res.json(rows)
})

app.listen(port, () => {
  console.log(`School map API running at http://127.0.0.1:${port}`)
})
