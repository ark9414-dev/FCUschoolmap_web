const officialEventsUrl = 'https://www.fcu.edu.tw/'
const iecsNewsUrl = 'https://www.iecs.fcu.edu.tw/news/'
const libraryNewsUrl = 'https://webii.lib.fcu.edu.tw/libnews/zh/'

const placeMatchers = [
  { placeId: 'library', keywords: ['圖書館', '圖212', '資訊素養教室'] },
  { placeId: 'activity', keywords: ['育樂', '社團', '學生會'] },
  { placeId: 'sports', keywords: ['體育', '運動', '體育館'] },
  { placeId: 'admin', keywords: ['註冊', '招生', '行政', '新生'] },
  { placeId: 'science-aero', keywords: ['航太', '科學與航太', '工程與科學'] },
  { placeId: 'business', keywords: ['商學', '商學院', '企業'] },
  { placeId: 'ciee', keywords: ['資電', '資訊電機', '資訊'] },
  { placeId: 'creative', keywords: ['創意', '展覽', '工作坊'] },
  { placeId: 'research', keywords: ['產學', '研究', '中科', '科研'] }
]

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .trim()
}

function stripTags(value) {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<\/(p|li|div|article|section|h[1-6]|span|a)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
}

function compactLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => decodeHtml(line))
    .filter(Boolean)
}

function isEventTitle(line) {
  if (line.length < 8 || line.length > 90) return false
  if (/^\d/.test(line)) return false
  if (line.includes('http')) return false
  if (/^(網站地圖|新聞與活動|精選活動|逢甲精選|新聞薈萃|分享|加入逢甲|看更多|View All)$/.test(line)) return false
  return /活動|招生|講座|徵選|研討會|報名|工作坊|展覽|說明會|徵稿|AI|Canva|FITI|TGIS/.test(line)
}

function parseOfficialEvents(html) {
  const cardEvents = parseEventCards(html)
  if (cardEvents.length > 0) return cardEvents

  const text = stripTags(html)
  const lines = compactLines(text)
  const events = []

  for (let index = 0; index < lines.length; index += 1) {
    const title = lines[index]
    const date = lines[index + 1] ?? ''
    const location = lines[index + 2] ?? ''
    const unit = lines[index + 3] ?? ''

    if (!isEventTitle(title)) continue
    if (!/\d{4}\.\d{2}\.\d{2}/.test(date)) continue

    const key = `${title}|${date}`
    if (events.some((event) => event.key === key)) continue

    events.push({
      key,
      title,
      date,
      location,
      unit,
      placeId: matchPlaceId(`${title} ${location} ${unit}`)
    })
  }

  return events.slice(0, 8)
}

function parseEventCards(html) {
  const cards = [...html.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*class="[^"]*a-event-card[^"]*"[^>]*>[\s\S]*?<\/a>/g)]
  const events = []

  for (const [cardHtml, href] of cards) {
    const title = textFromMatch(cardHtml.match(/a-event-card__title[\s\S]*?<span>([\s\S]*?)<\/span>/))
    const itemMatches = [...cardHtml.matchAll(/class="[^"]*a-event-card__text[^"]*"[^>]*>([\s\S]*?)<\/p>/g)].map((match) =>
      stripTags(match[1])
    )
    const [date = '', location = '', unit = ''] = itemMatches

    if (!title || !/\d{4}\.\d{2}\.\d{2}/.test(date)) continue

    const key = `${title}|${date}`
    if (events.some((event) => event.key === key)) continue

    events.push({
      key,
      title,
      date,
      location,
      unit,
      placeId: matchPlaceId(`${title} ${location} ${unit}`),
      sourceUrl: href
    })
  }

  return events.slice(0, 8)
}

function textFromMatch(match) {
  return match ? stripTags(match[1]) : ''
}

function absoluteUrl(url, baseUrl) {
  return new URL(url, baseUrl).href
}

function shortDetail(value) {
  return value.replace(/\s+/g, ' ').trim().slice(0, 72)
}

function parseIecsEvents(html) {
  const posts = [...html.matchAll(/<article\s+class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/article>/gi)]
  const events = []

  for (const [, postHtml] of posts) {
    const titleMatch = postHtml.match(/<a\s+class="[^"]*post-title[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)
    const href = titleMatch?.[1] ?? ''
    const title = stripTags(titleMatch?.[2] ?? '')
    const date = textFromMatch(postHtml.match(/<i\s+class="[^"]*fa-calendar-alt[^"]*"[^>]*><\/i>\s*<span[^>]*class="[^"]*meta-data[^"]*"[^>]*>([\s\S]*?)<\/span>/i))
    const category =
      textFromMatch(postHtml.match(/<i\s+class="[^"]*fa-folder[^"]*"[^>]*><\/i>\s*<span[^>]*class="[^"]*meta-data[^"]*"[^>]*>([\s\S]*?)<\/span>/i)) ||
      '系所公告'
    const detail = shortDetail(textFromMatch(postHtml.match(/<p\s+class="[^"]*post-description[^"]*"[^>]*>([\s\S]*?)<\/p>/i)))

    if (!title || !/\d{4}-\d{2}-\d{2}/.test(date)) continue

    events.push({
      key: `ciee|${title}|${date}`,
      title,
      date,
      location: '資訊電機館',
      unit: ['資訊工程學系', category, detail].filter(Boolean).join('｜'),
      placeId: 'ciee',
      sourceUrl: absoluteUrl(href, iecsNewsUrl)
    })
  }

  return events.slice(0, 5)
}

function parseChineseLibraryDate(value) {
  const match = value.match(/(\d{1,2})\s*月\s*(\d{1,2}),\s*(\d{4})/)
  if (!match) return ''

  const [, month, day, year] = match
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function parseLibraryEvents(html) {
  const posts = [...html.matchAll(/<h2[^>]*>\s*<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h2>([\s\S]*?)(?=<h2|<nav|<footer|$)/gi)]
  const events = []

  for (const [, href, titleHtml, bodyHtml] of posts) {
    const title = stripTags(titleHtml)
    const body = stripTags(bodyHtml)
    const date = parseChineseLibraryDate(body)
    const categories = [...body.matchAll(/(?:開放時間|活動\/展覽|一般公告|學位論文|愛閱分享王|試用資料庫|館藏資料庫)/g)].map(
      (match) => match[0]
    )
    const uniqueCategories = [...new Set(categories)]
    const unit = uniqueCategories.join('｜') || '圖書館公告'

    if (!title || !date) continue

    events.push({
      key: `library|${title}|${date}`,
      title,
      date,
      location: '圖書館',
      unit,
      placeId: 'library',
      sourceUrl: absoluteUrl(href, libraryNewsUrl)
    })
  }

  const activityEvents = events.filter((event) => /活動\/展覽|活動|書展/.test(`${event.title} ${event.unit}`))
  return (activityEvents.length > 0 ? activityEvents : events).slice(0, 5)
}

function matchPlaceId(text) {
  const matcher = placeMatchers.find((item) => item.keywords.some((keyword) => text.includes(keyword)))
  return matcher?.placeId ?? 'activity'
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'schoolmap-web-course-project/1.0'
    }
  })

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`)
  }

  return response.text()
}

async function fetchEventsFrom(url, parser, fallbackSourceUrl = url) {
  try {
    const html = await fetchHtml(url)
    return parser(html).map((event) => ({
      ...event,
      sourceUrl: event.sourceUrl ?? fallbackSourceUrl
    }))
  } catch (error) {
    console.warn(`Failed to fetch events from ${url}`, error)
    return []
  }
}

export async function fetchOfficialEvents() {
  const [iecsEvents, libraryEvents, officialEvents] = await Promise.all([
    fetchEventsFrom(iecsNewsUrl, parseIecsEvents),
    fetchEventsFrom(libraryNewsUrl, parseLibraryEvents),
    fetchEventsFrom(officialEventsUrl, parseOfficialEvents)
  ])

  return [...iecsEvents, ...libraryEvents, ...officialEvents]
}

export function syncOfficialEvents(db, events) {
  db.exec('DELETE FROM official_events')

  const insertEvent = db.prepare(`
    INSERT INTO official_events (
      place_id, title, date, location, unit, source_url, synced_at
    )
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `)

  for (const event of events) {
    insertEvent.run(event.placeId, event.title, event.date, event.location, event.unit, event.sourceUrl)
  }
}
