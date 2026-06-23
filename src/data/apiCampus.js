function apiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  if (import.meta.env.DEV) return 'http://127.0.0.1:3001'
  return ''
}

async function fetchJson(path, baseUrl) {
  const response = await fetch(`${baseUrl}${path}`)

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`)
  }

  return response.json()
}

function withAbsolutePhotoUrl(photo, baseUrl) {
  const url = photo.url.startsWith('http') ? photo.url : new URL(photo.url, `${baseUrl}/`).href

  return {
    ...photo,
    url
  }
}

export async function loadCampusDataset({ fallbackCampuses }) {
  const baseUrl = apiBaseUrl()
  if (!baseUrl) return null

  try {
    await fetchJson('/api/official-events?refresh=1', baseUrl)

    const [categories, campuses, places, photos, sources] = await Promise.all([
      fetchJson('/api/categories', baseUrl),
      fetchJson('/api/campuses', baseUrl),
      fetchJson('/api/places', baseUrl),
      fetchJson('/api/photos', baseUrl),
      fetchJson('/api/sources', baseUrl)
    ])

    const campusFallbackMap = Object.fromEntries(fallbackCampuses.map((campus) => [campus.id, campus]))
    const hydratedCampuses = campuses.map((campus) => ({
      ...campusFallbackMap[campus.id],
      ...campus
    }))
    const placePhotos = Object.fromEntries(
      photos.map((photo) => {
        const hydratedPhoto = withAbsolutePhotoUrl(photo, baseUrl)
        return [hydratedPhoto.placeId, hydratedPhoto]
      })
    )

    return {
      categories,
      campuses: hydratedCampuses,
      places,
      placePhotos,
      sources
    }
  } catch (error) {
    console.warn('Campus API unavailable, using static data instead.', error)
    return null
  }
}
