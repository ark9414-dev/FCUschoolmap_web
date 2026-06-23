# 逢甲大學動態校園地圖

使用 Vue、Vite、Leaflet、Express 與 SQLite 製作的逢甲大學互動校園導覽專案。前台提供可搜尋、可篩選、可點擊放大的校園地圖；後端提供地標、照片與活動公告 API；SQLite 儲存校區、分類、地標、照片與活動資料。

## 專案架構

```txt
schoolmap_web/
  server/                 Express API 與 SQLite seed
    data/
      schoolmap.sqlite    SQLite 資料庫
      seed-data.js        初始資料
    db.js
    seed.js
    server.js
  src/                    Vue + Vite 前端
    assets/
      maps/               官網校園圖
      photos/             建築照片
    data/                 前端靜態備援資料與 API loader
    App.vue
    styles.css
  .github/workflows/      GitHub Pages 自動部署
```

## 功能

- 校本部、福星校區、中科校區切換
- 地標搜尋與分類篩選
- 使用逢甲大學官網校園圖做主要底圖
- 點擊地標後放大到畫面中心，顯示建築照片與地標資訊
- 地標介紹含學生常用資訊、場地設備、小提醒與最近活動公告
- Express API 讀取 SQLite 資料庫
- GitHub Pages 靜態部署，後端未啟動時自動使用前端備援資料

## 後端 API

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

## 本機執行

安裝套件：

```bash
npm install
```

建立 SQLite 資料庫：

```bash
npm run seed
```

啟動 Express 後端：

```bash
npm run server
```

另開一個終端機啟動 Vue 前端：

```bash
npm run dev
```

前端網址預設為 `http://127.0.0.1:5173/index.dev.html`，後端 API 預設為 `http://127.0.0.1:3001`。

## 建置

```bash
npm run build
```

GitHub Pages 會透過 `.github/workflows/deploy.yml` 自動建置並部署。

## 參考資料

- 逢甲大學校園地圖：https://www.fcu.edu.tw/map/
- 逢甲大學官網：https://www.fcu.edu.tw/
- 逢甲大學圖書館：https://web.lib.fcu.edu.tw/library
- Wikimedia Commons 逢甲大學照片分類：https://commons.wikimedia.org/wiki/Category:Feng_Chia_University
