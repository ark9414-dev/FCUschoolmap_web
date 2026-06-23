import activityPhoto from '../assets/photos/activity.webp'
import admin2Photo from '../assets/photos/admin-2.jpg'
import adminPhoto from '../assets/photos/admin.jpg'
import architecturePhoto from '../assets/photos/architecture.jpg'
import businessPhoto from '../assets/photos/business.jpg'
import cieePhoto from '../assets/photos/ciee.webp'
import commonGoodPhoto from '../assets/photos/common-good.jpg'
import civilPhoto from '../assets/photos/civil.webp'
import creativePhoto from '../assets/photos/creative.jpg'
import engineeringPhoto from '../assets/photos/engineering.webp'
import humanitiesPhoto from '../assets/photos/humanities.jpg'
import languagePhoto from '../assets/photos/language.webp'
import renyanPhoto from '../assets/photos/renyan.webp'
import sciencePhoto from '../assets/photos/science.webp'
import scienceAeroPhoto from '../assets/photos/science-aero.jpg'
import sportsPhoto from '../assets/photos/sports.webp'
import telecomPhoto from '../assets/photos/telecom.jpg'
import xuesiPhoto from '../assets/photos/xuesi.jpg'
import zhongqinPhoto from '../assets/photos/zhongqin.jpg'

export const buildingPhotoRecords = [
  {
    placeId: 'common-good',
    url: commonGoodPhoto,
    caption: '共善樓建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'creative',
    url: creativePhoto,
    caption: '文創空間建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'architecture',
    url: architecturePhoto,
    caption: '建築相關空間實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'humanities',
    url: humanitiesPhoto,
    caption: '人文社會建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'telecom',
    url: telecomPhoto,
    caption: '資訊電通建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'renyan',
    url: renyanPhoto,
    caption: '人言大樓正面建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'business',
    url: businessPhoto,
    caption: '商學大樓建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'civil',
    url: civilPhoto,
    caption: '土木水利館建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'xuesi',
    url: xuesiPhoto,
    caption: '學思樓建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'engineering',
    url: engineeringPhoto,
    caption: '工程與科技相關建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'zhongqin',
    url: zhongqinPhoto,
    caption: '忠勤樓建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'science',
    url: sciencePhoto,
    caption: '理學大樓建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'science-aero',
    url: scienceAeroPhoto,
    caption: '科學與航太館建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'activity',
    url: activityPhoto,
    caption: '育樂館建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'admin',
    url: adminPhoto,
    caption: '行政大樓建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'admin-2',
    url: admin2Photo,
    caption: '行政二館建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'language',
    url: languagePhoto,
    caption: '語文大樓建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'ciee',
    url: cieePhoto,
    caption: '資訊電機館建築實景',
    credit: '本專案建築照片資料庫'
  },
  {
    placeId: 'sports',
    url: sportsPhoto,
    caption: '體育館建築實景',
    credit: '本專案建築照片資料庫'
  }
]

export const buildingPhotoMap = Object.fromEntries(
  buildingPhotoRecords.map((record) => [
    record.placeId,
    {
      url: record.url,
      caption: record.caption,
      credit: record.credit,
      source: '',
      kind: 'photo'
    }
  ])
)
