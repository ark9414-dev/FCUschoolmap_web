# 逢甲大學動態校園地圖作業說明

## 基本資料

- 專題名稱：逢甲大學動態校園地圖
- GitHub Repository：https://github.com/peanut9121/schoolmap_web
- GitHub Pages：https://peanut9121.github.io/schoolmap_web/
- 組員：請填入姓名、班級、小組名稱

## 專案目標

本專案希望整理逢甲大學學生常用的教學大樓、行政空間、生活空間、體育場地與宿舍資訊，製作成一個可搜尋、可篩選、可點擊查看照片與公告的互動校園地圖。

## 技術架構

```txt
Vue + Vite + Leaflet
        |
        | fetch API
        v
Express 後端
        |
        | SQL query
        v
SQLite 資料庫
```

前端負責互動地圖、地標篩選、地標放大動畫與資訊呈現。後端負責提供地標、校區、分類、照片與活動公告資料。SQLite 儲存資料表，讓專案符合前台、後端、資料庫的完整架構。

## 資料庫設計

SQLite 檔案位置：

```txt
server/data/schoolmap.sqlite
```

主要資料表：

- `categories`：地標分類，例如教學、行政服務、學生生活。
- `campuses`：校區資料，例如校本部、福星校區、中科校區。
- `places`：地標資料，包含名稱、代碼、座標、介紹、常用資訊、設備與提醒。
- `photos`：地標照片資料，包含地標 ID、圖片路徑、說明與來源。
- `activities`：最近活動公告資料。
- `category_activity_templates`：分類預設公告資料。
- `sources`：資料來源連結。

## API 設計

```txt
GET  /api/health
GET  /api/categories
GET  /api/campuses
GET  /api/places
GET  /api/places/:id
GET  /api/photos
GET  /api/photos/:placeId
GET  /api/activities
POST /api/activities
GET  /api/sources
```

其中 `POST /api/activities` 可以新增活動公告，展示後端寫入資料庫的能力。

## 前端功能

- 顯示逢甲大學校本部、福星校區、中科校區。
- 使用逢甲大學官網校園圖作為地圖底圖。
- 支援地標搜尋與分類篩選。
- 點擊地標後，地圖放大到該地標附近並顯示浮動資訊卡。
- 資訊卡顯示建築照片、地標介紹、分類、校區與活動公告。
- 前端會優先讀取 Express API；若後端未啟動，會自動使用前端靜態資料，讓 GitHub Pages 仍可正常展示。

## 參考資料與參考部分

- 逢甲大學校園地圖：https://www.fcu.edu.tw/map/
  - 參考校區底圖、建築位置與校區資訊。
- 逢甲大學官網：https://www.fcu.edu.tw/
  - 參考校名、校區資訊與學校公開資料。
- Leaflet 官方文件：https://leafletjs.com/
  - 參考互動地圖、marker、image overlay 與 zoom 控制方式。
- Vue 官方文件：https://vuejs.org/
  - 參考 Composition API 與元件資料綁定方式。
- Express 官方文件：https://expressjs.com/
  - 參考 API 路由與 JSON middleware 寫法。
- Node.js SQLite 文件：https://nodejs.org/api/sqlite.html
  - 參考 Node 內建 SQLite API。

## 開發流程

1. 建立 Vue + Vite 前端專案。
2. 使用 Leaflet 顯示校園圖，並依官網校園圖重新標定地標座標。
3. 製作地標列表、搜尋、分類、點擊放大與資訊卡。
4. 加入建築照片資料，並讓地標卡片顯示實景照片。
5. 新增活動公告欄位。
6. 建立 Express 後端與 SQLite 資料庫。
7. 建立 seed 腳本，將校區、地標、照片與活動資料寫入 SQLite。
8. 前端改成優先讀取 API，失敗時回退靜態資料。
9. 使用 GitHub Actions 與 GitHub Pages 部署。

## 執行方式

```bash
npm install
npm run seed
npm run server
```

另開終端機：

```bash
npm run dev
```

## 面試可說明重點

- 為什麼需要後端：讓地標、照片與活動公告可以由 API 管理，不必每次都改前端程式。
- 為什麼仍保留靜態資料：GitHub Pages 只能部署前端靜態頁面，保留 fallback 可確保線上展示穩定。
- SQLite 的角色：儲存校園資料、照片路徑與活動公告，符合資料庫需求。
- Leaflet 的角色：處理地圖、校園圖 overlay、marker、zoom 與 bounds 限制。
