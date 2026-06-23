<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  campuses as staticCampuses,
  categories as staticCategories,
  defaultPlacePhoto,
  placePhotos as staticPlacePhotos,
  places as staticPlaces,
  sources as staticSources
} from './data/campus'
import { loadCampusDataset } from './data/apiCampus'

const activeCampus = ref('main')
const activeCategory = ref('all')
const query = ref('')
const selectedId = ref('library')
const mapElement = ref(null)
const hasFocusedPlace = ref(false)
const photoLoadFailed = ref(false)
const categories = ref(staticCategories)
const campuses = ref(staticCampuses)
const places = ref(staticPlaces)
const placePhotos = ref(staticPlacePhotos)
const sources = ref(staticSources)
const dataMode = ref('靜態')

let map
let baseLayer
let markerLayer

const campus = computed(() => campuses.value.find((item) => item.id === activeCampus.value))
const campusPlaces = computed(() => places.value.filter((place) => place.campus === activeCampus.value))

const filteredPlaces = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  return campusPlaces.value.filter((place) => {
    const matchCategory = activeCategory.value === 'all' || place.category === activeCategory.value
    const matchKeyword =
      !keyword ||
      [place.name, place.code, place.intro, place.activity?.title, place.activity?.detail, ...place.usefulFor, ...place.facilities]
        .join(' ')
        .toLowerCase()
        .includes(keyword)

    return matchCategory && matchKeyword
  })
})

const selectedPlace = computed(() => {
  const direct = places.value.find((place) => place.id === selectedId.value)
  return direct?.campus === activeCampus.value ? direct : filteredPlaces.value[0] ?? campusPlaces.value[0]
})
const campusFallbackPhoto = computed(() => ({
  url: campus.value?.mapImage ?? defaultPlacePhoto.url,
  caption: `${campus.value?.name ?? '校園'}官網校園圖定位`,
  credit: '逢甲大學校園地圖',
  source: 'https://www.fcu.edu.tw/map/',
  kind: 'map'
}))
const selectedPhoto = computed(() => placePhotos.value[selectedPlace.value?.id] ?? campusFallbackPhoto.value)
const displayedPhoto = computed(() => (photoLoadFailed.value ? campusFallbackPhoto.value : selectedPhoto.value))
const focusPanelActive = computed(() => hasFocusedPlace.value && selectedPlace.value)
const selectedActivity = computed(() => selectedPlace.value?.activity)

const stats = computed(() => [
  { label: '校區', value: campuses.value.length },
  { label: '地點', value: places.value.length },
  { label: '建築照片', value: Object.keys(placePhotos.value).length },
  { label: '資料模式', value: dataMode.value }
])

function selectCampus(id) {
  activeCampus.value = id
  const firstPlace = places.value.find((place) => place.campus === id)
  selectedId.value = firstPlace?.id ?? selectedId.value
  hasFocusedPlace.value = false
}

function selectPlace(id, focus = true) {
  selectedId.value = id
  hasFocusedPlace.value = focus

  if (focus) {
    nextTick(() => focusMapOnPlace(selectedPlace.value))
  }
}

function clearFocusPanel() {
  hasFocusedPlace.value = false
  resetMapToCampus()
}

function handlePhotoError() {
  photoLoadFailed.value = true
}

function pointForPlace(place) {
  const currentCampus = campuses.value.find((item) => item.id === place.campus)
  return [(place.y / 100) * currentCampus.mapSize.height, (place.x / 100) * currentCampus.mapSize.width]
}

function boundsForCampus(targetCampus) {
  return [
    [0, 0],
    [targetCampus.mapSize.height, targetCampus.mapSize.width]
  ]
}

function baseLayerForCampus() {
  return L.imageOverlay(campus.value.mapImage, boundsForCampus(campus.value), {
    opacity: 1,
    zIndex: 1,
    attribution: '<a href="https://www.fcu.edu.tw/map/">逢甲大學校園地圖</a>'
  })
}

function clamp(value, min, max) {
  if (max < min) return (min + max) / 2
  return Math.min(Math.max(value, min), max)
}

function boundedCenterForPlace(place, zoom) {
  const target = L.latLng(pointForPlace(place))
  const campusBounds = boundsForCampus(campus.value)
  const projectedCorners = [
    map.project(campusBounds[0], zoom),
    map.project([campusBounds[0][0], campusBounds[1][1]], zoom),
    map.project([campusBounds[1][0], campusBounds[0][1]], zoom),
    map.project(campusBounds[1], zoom)
  ]
  const minX = Math.min(...projectedCorners.map((point) => point.x))
  const maxX = Math.max(...projectedCorners.map((point) => point.x))
  const minY = Math.min(...projectedCorners.map((point) => point.y))
  const maxY = Math.max(...projectedCorners.map((point) => point.y))
  const halfSize = map.getSize().divideBy(2)
  const projectedTarget = map.project(target, zoom)
  const x = clamp(projectedTarget.x, minX + halfSize.x, maxX - halfSize.x)
  const y = clamp(projectedTarget.y, minY + halfSize.y, maxY - halfSize.y)

  return map.unproject(L.point(x, y), zoom)
}

function focusMapOnPlace(place) {
  if (!map || !place || !campus.value) return

  const targetZoom = Math.min(map.getMaxZoom(), Math.max(map.getZoom(), 1.35))
  const safeCenter = boundedCenterForPlace(place, targetZoom)
  map.stop()
  map.flyTo(safeCenter, targetZoom, {
    animate: true,
    duration: 0.72,
    easeLinearity: 0.22
  })
}

function createMarkerIcon(place) {
  const isSelected = selectedPlace.value?.id === place.id
  const isMuted = !filteredPlaces.value.some((item) => item.id === place.id)

  return L.divIcon({
    className: [
      'leaflet-campus-marker',
      `marker-${place.category}`,
      isSelected ? 'is-selected' : '',
      isSelected && hasFocusedPlace.value ? 'is-focused' : '',
      isMuted ? 'is-muted' : ''
    ]
      .filter(Boolean)
      .join(' '),
    html: `<span>${place.code}</span>`,
    iconSize: [50, 26],
    iconAnchor: [25, 18],
    popupAnchor: [0, -20]
  })
}

function renderMarkers() {
  if (!map || !markerLayer) return

  markerLayer.clearLayers()

  campusPlaces.value.forEach((place) => {
    const marker = L.marker(pointForPlace(place), {
      icon: createMarkerIcon(place),
      keyboard: true,
      title: place.name
    })

    marker.bindTooltip(`${place.name}｜${place.code}`, {
      direction: 'top',
      offset: [0, -18],
      opacity: 0.95
    })

    marker.on('click', () => selectPlace(place.id, true))
    markerLayer.addLayer(marker)
  })
}

function refreshMapMarkers() {
  renderMarkers()
  nextTick(() => map?.invalidateSize())
}

function resetMapToCampus({ animate = true } = {}) {
  if (!map || !campus.value) return

  const campusBounds = boundsForCampus(campus.value)
  map.stop()
  map.setMaxBounds(campusBounds)
  map.fitBounds(campusBounds, {
    animate,
    padding: [34, 34]
  })
  refreshMapMarkers()
}

function syncBaseLayer() {
  if (!map) return
  if (baseLayer) baseLayer.remove()

  baseLayer = baseLayerForCampus().addTo(map)
}

async function hydrateCampusDataset() {
  const dataset = await loadCampusDataset({ fallbackCampuses: staticCampuses })
  if (!dataset) return

  categories.value = dataset.categories
  campuses.value = dataset.campuses
  places.value = dataset.places
  placePhotos.value = {
    ...staticPlacePhotos,
    ...dataset.placePhotos
  }
  sources.value = dataset.sources
  dataMode.value = 'API'
  photoLoadFailed.value = false

  if (map) {
    syncBaseLayer()
    resetMapToCampus({ animate: false })
  }
}

onMounted(() => {
  map = L.map(mapElement.value, {
    crs: L.CRS.Simple,
    center: [campus.value.mapSize.height / 2, campus.value.mapSize.width / 2],
    zoom: 0,
    minZoom: -2,
    maxZoom: 3,
    zoomSnap: 0.25,
    zoomControl: false,
    scrollWheelZoom: true,
    attributionControl: true
  })

  L.control.zoom({ position: 'bottomright' }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  syncBaseLayer()
  resetMapToCampus({ animate: false })
  hydrateCampusDataset()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = undefined
  }
})

watch(activeCampus, () => {
  syncBaseLayer()
  resetMapToCampus()
})

watch([activeCategory, query], () => {
  refreshMapMarkers()
})

watch(selectedPlace, (place) => {
  if (!map || !place) return
  photoLoadFailed.value = false
  renderMarkers()
})

watch(hasFocusedPlace, () => {
  renderMarkers()
})
</script>

<template>
  <main class="shell">
    <section class="hero">
      <div class="hero__copy">
        <p class="eyebrow">Feng Chia University Campus Navigator</p>
        <h1>逢甲大學動態校園地圖</h1>
        <p>
          把教學大樓、宿舍、圖書館、體育與社團活動空間整理成一張可搜尋、可篩選、可公告活動的學生導覽圖。
        </p>
      </div>

      <div class="hero__panel" aria-label="專案統計">
        <div v-for="item in stats" :key="item.label" class="metric">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </section>

    <section class="workspace" aria-label="互動校園地圖">
      <aside class="sidebar">
        <div>
          <p class="section-kicker">校區</p>
          <div class="campus-tabs">
            <button
              v-for="item in campuses"
              :key="item.id"
              type="button"
              :class="{ active: activeCampus === item.id }"
              @click="selectCampus(item.id)"
            >
              <span class="tab-dot" :style="{ backgroundColor: item.color }"></span>
              {{ item.name }}
            </button>
          </div>
        </div>

        <label class="search">
          <span>搜尋地點、用途或設備</span>
          <input v-model="query" type="search" placeholder="例如：圖書館、體育、宿舍" />
        </label>

        <div>
          <p class="section-kicker">分類</p>
          <div class="filters">
            <button
              v-for="item in categories"
              :key="item.id"
              type="button"
              :class="{ active: activeCategory === item.id }"
              @click="activeCategory = item.id"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="place-list" aria-label="地點列表">
          <button
            v-for="place in filteredPlaces"
            :key="place.id"
            type="button"
            :class="{ active: selectedPlace?.id === place.id }"
            @click="selectPlace(place.id, true)"
          >
            <span>
              <strong>{{ place.name }}</strong>
              <small>{{ place.code }} · {{ categories.find((item) => item.id === place.category)?.label }}</small>
            </span>
          </button>
        </div>
      </aside>

      <section class="map-card">
        <div class="map-toolbar">
          <div>
            <p class="section-kicker">{{ campus?.name }}</p>
            <h2>{{ campus?.address }}</h2>
          </div>
          <div class="map-toolbar__right">
            <p>{{ campus?.summary }}</p>
            <span class="map-source-badge">官網校園圖座標</span>
          </div>
        </div>

        <div class="map-wrap" :class="{ 'is-place-focused': focusPanelActive }">
          <div ref="mapElement" class="real-campus-map" role="application" aria-label="逢甲大學真實俯視互動地圖"></div>

          <article v-if="focusPanelActive" class="landmark-focus-card" aria-live="polite">
            <button class="focus-close" type="button" aria-label="收起地標快覽" @click="clearFocusPanel">×</button>
            <figure>
              <img
                :class="{ 'is-map-reference': displayedPhoto.kind === 'map' }"
                :src="displayedPhoto.url"
                :alt="`${selectedPlace.name}參考圖片`"
                @error="handlePhotoError"
              />
              <figcaption>
                {{ displayedPhoto.caption }}
                <a v-if="displayedPhoto.source" :href="displayedPhoto.source" target="_blank" rel="noreferrer">
                  {{ displayedPhoto.credit }}
                </a>
                <span v-else>{{ displayedPhoto.credit }}</span>
              </figcaption>
            </figure>
            <div class="focus-copy">
              <p class="section-kicker">地標快覽</p>
              <h3>{{ selectedPlace.name }}</h3>
              <p>{{ selectedPlace.intro }}</p>
              <div class="focus-meta">
                <span>{{ selectedPlace.code }}</span>
                <span>{{ categories.find((item) => item.id === selectedPlace.category)?.label }}</span>
                <span>{{ campus?.name }}</span>
              </div>
            </div>
          </article>

          <div class="map-legend">
            <span><i class="legend-building"></i> 官網地標</span>
            <span><i class="legend-road"></i> 裁切校園範圍</span>
          </div>
        </div>
      </section>

      <aside class="detail-card" v-if="selectedPlace">
        <figure class="detail-photo">
          <img
            :class="{ 'is-map-reference': displayedPhoto.kind === 'map' }"
            :src="displayedPhoto.url"
            :alt="`${selectedPlace.name}參考圖片`"
            @error="handlePhotoError"
          />
          <figcaption>{{ displayedPhoto.caption }}</figcaption>
        </figure>
        <p class="section-kicker">目前選取</p>
        <h2>{{ selectedPlace.name }}</h2>
        <p class="code">{{ selectedPlace.code }} · {{ campus?.name }}</p>
        <p class="intro">{{ selectedPlace.intro }}</p>

        <div class="activity-notice" v-if="selectedActivity">
          <div>
            <span>{{ selectedActivity.status }}</span>
            <strong>{{ selectedActivity.date }}</strong>
          </div>
          <h3>{{ selectedActivity.title }}</h3>
          <p>{{ selectedActivity.detail }}</p>
          <a v-if="selectedActivity.source" :href="selectedActivity.source" target="_blank" rel="noreferrer">
            查看官網公告
          </a>
        </div>

        <div class="info-block">
          <h3>學生常用</h3>
          <ul>
            <li v-for="item in selectedPlace.usefulFor" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="info-block">
          <h3>場地與設備</h3>
          <div class="chips">
            <span v-for="item in selectedPlace.facilities" :key="item">{{ item }}</span>
          </div>
        </div>

        <div class="tip">
          <strong>小提醒</strong>
          <p>{{ selectedPlace.tip }}</p>
        </div>
      </aside>
    </section>

    <section class="source-band">
      <div>
        <p class="section-kicker">資料備註</p>
        <h2>目前是校園導覽原型，可再接正式樓層、教室與即時公告資料。</h2>
      </div>
      <div class="sources">
        <a v-for="source in sources" :key="source.url" :href="source.url" target="_blank" rel="noreferrer">
          {{ source.label }}
        </a>
      </div>
    </section>
  </main>
</template>
