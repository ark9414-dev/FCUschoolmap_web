export const categories = [
  { id: 'all', label: '全部' },
  { id: 'learning', label: '教學' },
  { id: 'service', label: '行政服務' },
  { id: 'life', label: '學生生活' },
  { id: 'sports', label: '運動場地' },
  { id: 'dorm', label: '宿舍' }
]

export const campuses = [
  {
    id: 'main',
    name: '校本部',
    address: '臺中市西屯區文華路100號',
    summary: '依逢甲大學官網校本部平面圖重新標定教學、行政與活動空間。',
    color: '#8f1f2f',
    mapSize: { width: 760, height: 604 }
  },
  {
    id: 'fuxing',
    name: '福星校區',
    address: '臺中市西屯區福星北路98號',
    summary: '以官網福星校區圖為基準，整理宿舍生活區。',
    color: '#2f7f6f',
    mapSize: { width: 330, height: 420 }
  },
  {
    id: 'ctsp',
    name: '中科校區',
    address: '臺中市西屯區東大路一段951號',
    summary: '以官網中科校區圖為基準，聚焦科研大樓與校區出入口。',
    color: '#355c9f',
    mapSize: { width: 1320, height: 700 }
  }
]

export const places = [
  {
    id: 'creative',
    campus: 'main',
    name: '文創',
    code: '文創',
    category: 'life',
    x: 7,
    y: 85,
    intro: '靠近文華路側的創意、展覽與活動空間。',
    usefulFor: ['展覽活動', '創意課程', '跨域交流'],
    facilities: ['展演空間', '活動空間'],
    tip: '想看校內展覽或活動，可以把這裡列入巡覽點。'
  },
  {
    id: 'xuesi',
    campus: 'main',
    name: '學思樓',
    code: '學思',
    category: 'life',
    x: 16,
    y: 90,
    intro: '校園北側常見集合與學習記憶點。',
    usefulFor: ['自習集合', '小組討論', '課間休息'],
    facilities: ['學習空間', '交流空間'],
    tip: '適合作為朋友集合點，位置在官網圖左上方。'
  },
  {
    id: 'civil',
    campus: 'main',
    name: '土木水利館',
    code: '土水',
    category: 'learning',
    x: 14,
    y: 74,
    intro: '土木、水利與建設相關課程和實驗使用空間。',
    usefulFor: ['土木水利課程', '實驗課', '專業討論'],
    facilities: ['專業教室', '實驗室'],
    tip: '官網圖中位於學思樓下方，靠校園西側。'
  },
  {
    id: 'science',
    campus: 'main',
    name: '理學大樓',
    code: '理學',
    category: 'learning',
    x: 28,
    y: 77,
    intro: '基礎科學與理學相關課程地點。',
    usefulFor: ['數理課程', '基礎科學', '實驗討論'],
    facilities: ['一般教室', '專業教室'],
    tip: '與土木水利館相鄰，適合一起確認上課動線。'
  },
  {
    id: 'sports',
    campus: 'main',
    name: '體育館',
    code: '體育',
    category: 'sports',
    x: 46,
    y: 86,
    intro: '體育課、校隊訓練與運動活動的主要空間。',
    usefulFor: ['體育課', '運動活動', '賽事集合'],
    facilities: ['室內場地', '體育課空間', '運動服務'],
    tip: '官網圖中位於上方中央，靠近綜合運動場。'
  },
  {
    id: 'common-good',
    campus: 'main',
    name: '共善樓',
    code: '共善',
    category: 'life',
    x: 80,
    y: 34,
    intro: '校園內兼具學習、交流與公共活動機能的特色建築。',
    usefulFor: ['校園導覽', '活動集合', '跨域交流'],
    facilities: ['公共空間', '交流場域', '活動空間'],
    tip: '可作為校園北側建物群的辨識點。'
  },
  {
    id: 'zhongqin',
    campus: 'main',
    name: '忠勤樓',
    code: '忠勤',
    category: 'learning',
    x: 11,
    y: 34,
    intro: '一般課程與教學活動使用頻率高的大樓。',
    usefulFor: ['通識課', '共同科目', '大型課程'],
    facilities: ['一般教室', '討論空間'],
    tip: '官網圖中位於語文大樓下方，靠西側動線。'
  },
  {
    id: 'activity',
    campus: 'main',
    name: '育樂館',
    code: '育樂',
    category: 'life',
    x: 15,
    y: 59,
    intro: '社團、學生自治與活動排練常用空間。',
    usefulFor: ['社團活動', '排練集合', '學生會活動'],
    facilities: ['活動教室', '社團空間'],
    tip: '開學社團活動期間，這裡很適合納入新生路線。'
  },
  {
    id: 'language',
    campus: 'main',
    name: '語文大樓',
    code: '語文',
    category: 'learning',
    x: 15,
    y: 45,
    intro: '語文課程、外語學習與相關教學活動地點。',
    usefulFor: ['英文課', '第二外語', '語言檢定準備'],
    facilities: ['語言教室', '一般教室'],
    tip: '官網圖中位於育樂館下方，和建築館相鄰。'
  },
  {
    id: 'architecture',
    campus: 'main',
    name: '建築',
    code: '建築',
    category: 'learning',
    x: 16,
    y: 41,
    intro: '設計、建築與評圖相關活動的特色空間。',
    usefulFor: ['建築設計課', '模型製作', '作品評圖'],
    facilities: ['設計教室', '評圖區', '工作空間'],
    tip: '官網圖中緊鄰語文大樓，標示為直排文字。'
  },
  {
    id: 'engineering',
    campus: 'main',
    name: '工學館',
    code: '工學',
    category: 'learning',
    x: 29,
    y: 39,
    intro: '工程與實作課程常見的教學據點。',
    usefulFor: ['工程課', '專題實作', '助教討論'],
    facilities: ['專業教室', '實驗室', '討論區'],
    tip: '官網圖中位於語文大樓右側，接近人言大樓。'
  },
  {
    id: 'renyan',
    campus: 'main',
    name: '人言大樓',
    code: '人言',
    category: 'learning',
    x: 41,
    y: 43,
    intro: '跨領域課程、講座與大型活動常見場域。',
    usefulFor: ['大型課程', '演講活動', '跨院交流'],
    facilities: ['大型教室', '活動空間', '研討區'],
    tip: '官網圖中位於校本部中段，是很重要的方向參考。'
  },
  {
    id: 'humanities',
    campus: 'main',
    name: '人文社會',
    code: '人文',
    category: 'learning',
    x: 54,
    y: 45,
    intro: '人文、社會、通識與討論型課程常見場域。',
    usefulFor: ['通識課', '小組討論', '社會議題課程'],
    facilities: ['一般教室', '研討教室'],
    tip: '官網圖中位於人言大樓右側。'
  },
  {
    id: 'telecom',
    campus: 'main',
    name: '資訊電通',
    code: '電通',
    category: 'learning',
    x: 62,
    y: 45,
    intro: '資訊、電通相關課程與教學空間。',
    usefulFor: ['電通課程', '專業教室', '系所活動'],
    facilities: ['教室', '系所空間'],
    tip: '官網圖中與人文社會並列，靠近資訊電機館。'
  },
  {
    id: 'ciee',
    campus: 'main',
    name: '資訊電機館',
    code: '資電',
    category: 'learning',
    x: 60,
    y: 32,
    intro: '資訊、電機、通訊與程式實作相關課程常用區域。',
    usefulFor: ['程式設計課', '硬體實驗', '專題開發'],
    facilities: ['電腦教室', '實驗室', '系所辦公室'],
    tip: '官網圖中位於人文社會與資訊電通下方，靠近圖書館。'
  },
  {
    id: 'library',
    campus: 'main',
    name: '圖書館',
    code: '圖書',
    category: 'life',
    x: 47,
    y: 18,
    intro: '查資料、自習、借書與安靜讀書的核心地點。',
    usefulFor: ['期中期末自習', '借閱圖書與電子資源', '小組資料查找'],
    facilities: ['閱覽區', '館藏查詢', '資訊檢索'],
    tip: '官網圖中位於下方中央，是校園導覽重要地標。'
  },
  {
    id: 'business',
    campus: 'main',
    name: '商學大樓',
    code: '商學',
    category: 'learning',
    x: 61,
    y: 10,
    intro: '商管、會計、行銷與管理課程的高頻教學據點。',
    usefulFor: ['商管課程', '專題報告', '企業講座'],
    facilities: ['一般教室', '研討空間', '院系辦公室'],
    tip: '官網圖中位於圖書館右下方。'
  },
  {
    id: 'science-aero',
    campus: 'main',
    name: '科學與航太館',
    code: '航太',
    category: 'learning',
    x: 49,
    y: 9,
    intro: '工程與科技相關課程、實驗與專業教室常見區域。',
    usefulFor: ['工程課程', '實驗課', '專題討論'],
    facilities: ['實驗室', '專業教室', '自修空間'],
    tip: '官網圖中位於圖書館下方。'
  },
  {
    id: 'memorial',
    campus: 'main',
    name: '丘逢甲紀念館',
    code: '紀念',
    category: 'service',
    x: 33,
    y: 8,
    intro: '校史與紀念性空間，也是認識逢甲精神的入口。',
    usefulFor: ['校史參觀', '校園導覽', '重要典禮集合'],
    facilities: ['展示空間', '紀念場域'],
    tip: '官網圖中位於校本部下方中央偏左。'
  },
  {
    id: 'admin',
    campus: 'main',
    name: '行政大樓',
    code: '行政',
    category: 'service',
    x: 14,
    y: 17,
    intro: '校務行政與校內洽公常用據點。',
    usefulFor: ['註冊與行政洽詢', '校內文件辦理', '新生入學相關問題'],
    facilities: ['服務櫃台', '行政辦公室', '公告資訊'],
    tip: '官網圖中位於西南側，靠近汽車停車場標示。'
  },
  {
    id: 'admin-2',
    campus: 'main',
    name: '行政二館',
    code: '行二',
    category: 'service',
    x: 25,
    y: 19,
    intro: '官網圖標示的第二行政空間。',
    usefulFor: ['行政洽詢', '校內服務', '文件辦理'],
    facilities: ['行政辦公室'],
    tip: '與行政大樓相鄰，辦理事項前可先確認承辦單位。'
  },
  {
    id: 'fuxing-e',
    campus: 'fuxing',
    name: '學舍 E',
    code: '舍E',
    category: 'dorm',
    x: 17,
    y: 95,
    intro: '福星校區住宿空間之一。',
    usefulFor: ['住宿生活', '新生搬宿', '夜間返校'],
    facilities: ['宿舍', '公共空間'],
    tip: '官網圖中位於福星校區標示區上方。'
  },
  {
    id: 'fuxing-f',
    campus: 'fuxing',
    name: '學舍 F',
    code: '舍F',
    category: 'dorm',
    x: 5,
    y: 88,
    intro: '福星校區住宿空間之一。',
    usefulFor: ['住宿生活', '新生搬宿', '夜間返校'],
    facilities: ['宿舍', '公共空間'],
    tip: '官網圖中位於學舍 E 左下側。'
  },
  {
    id: 'excellent',
    campus: 'fuxing',
    name: '精采學舍',
    code: '精采',
    category: 'dorm',
    x: 19,
    y: 66,
    intro: '福星校區住宿生活區之一。',
    usefulFor: ['住宿', '交流活動', '生活服務'],
    facilities: ['宿舍', '公共空間'],
    tip: '可把宿舍、校本部、逢甲商圈設定成新生生活三角。'
  },
  {
    id: 'male-dorm',
    campus: 'fuxing',
    name: '男生宿舍',
    code: '男宿',
    category: 'dorm',
    x: 62,
    y: 44,
    intro: '學生住宿與日常生活支援據點。',
    usefulFor: ['住宿', '生活洽詢', '門禁管理'],
    facilities: ['寢室', '公共空間', '管理服務'],
    tip: '夜間返宿時，注意校區周邊動線與安全。'
  },
  {
    id: 'female-dorm',
    campus: 'fuxing',
    name: '女生宿舍',
    code: '女宿',
    category: 'dorm',
    x: 25,
    y: 21,
    intro: '學生住宿與生活管理空間。',
    usefulFor: ['住宿', '生活洽詢', '門禁管理'],
    facilities: ['寢室', '公共空間', '管理服務'],
    tip: '搬宿日人潮多，行李動線可以先規劃。'
  },
  {
    id: 'fuxing-a-d',
    campus: 'fuxing',
    name: '逢甲學舍 A-D',
    code: '舍AD',
    category: 'dorm',
    x: 70,
    y: 8,
    intro: '福星校區主要住宿空間之一。',
    usefulFor: ['住宿生活', '新生搬宿', '夜間返校'],
    facilities: ['宿舍', '生活服務', '公共空間'],
    tip: '住宿生建議把往返校本部的步行時間抓進課表。'
  },
  {
    id: 'research',
    campus: 'ctsp',
    name: '科研大樓',
    code: '科研',
    category: 'learning',
    x: 25,
    y: 39,
    intro: '中科校區科研與產學合作相關空間。',
    usefulFor: ['研究活動', '產學合作', '專題參訪'],
    facilities: ['研究空間', '會議空間', '產研場域'],
    tip: '前往中科校區前，先確認交通時間與集合位置。'
  }
]

export const activities = [
  {
    placeId: 'library',
    status: '活動公告',
    date: '本週',
    title: '圖書館自習與資源利用提醒',
    detail: '期中期末前可公告延長開放、資料庫教學、館藏導覽與自習座位使用資訊。'
  },
  {
    placeId: 'activity',
    status: '社團公告',
    date: '本月',
    title: '社團成果與活動報名',
    detail: '適合公告社團博覽會、成果發表、學生會活動、排練借用與活動報名資訊。'
  },
  {
    placeId: 'sports',
    status: '賽事公告',
    date: '近期',
    title: '體育課程與校隊活動',
    detail: '可公告校內賽事、體育館場地借用、校隊練習與體育課集合資訊。'
  },
  {
    placeId: 'admin',
    status: '行政公告',
    date: '近期',
    title: '新生與註冊服務提醒',
    detail: '可公告註冊繳費、學生證、成績單、兵役與各類校內文件辦理資訊。'
  },
  {
    placeId: 'creative',
    status: '展演公告',
    date: '本月',
    title: '展覽與創意活動',
    detail: '可公告校內展覽、創意工作坊、跨域活動與作品展示時間。'
  },
  {
    placeId: 'research',
    status: '產研公告',
    date: '近期',
    title: '產學合作與參訪活動',
    detail: '可公告研究展示、企業參訪、專題發表與中科校區交通集合資訊。'
  }
]

export const categoryActivityTemplates = {
  learning: {
    status: '教學公告',
    date: '近期',
    title: '課程與專題活動更新',
    detail: '可在此欄位公告系所講座、專題發表、教室異動或開放參觀資訊。'
  },
  service: {
    status: '行政公告',
    date: '近期',
    title: '服務時間與辦理事項提醒',
    detail: '可公告註冊、文件申請、洽公時間調整與新生服務資訊。'
  },
  life: {
    status: '活動公告',
    date: '近期',
    title: '學生生活活動更新',
    detail: '可公告展覽、社團活動、讀書資源、集合地點或校園活動資訊。'
  },
  sports: {
    status: '場地公告',
    date: '近期',
    title: '體育活動與場地使用提醒',
    detail: '可公告體育課、校隊練習、賽事、場地維護或借用時間。'
  },
  dorm: {
    status: '住宿公告',
    date: '近期',
    title: '宿舍生活與門禁提醒',
    detail: '可公告搬宿、門禁、公共空間使用、住宿活動與生活服務資訊。'
  }
}

export const photos = [
  { placeId: 'common-good', imageUrl: '/photos/common-good.jpg', caption: '共善樓建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'creative', imageUrl: '/photos/creative.jpg', caption: '文創空間建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'architecture', imageUrl: '/photos/architecture.jpg', caption: '建築相關空間實景', credit: '本專案建築照片資料庫' },
  { placeId: 'humanities', imageUrl: '/photos/humanities.jpg', caption: '人文社會建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'telecom', imageUrl: '/photos/telecom.jpg', caption: '資訊電通建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'renyan', imageUrl: '/photos/renyan.webp', caption: '人言大樓正面建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'business', imageUrl: '/photos/business.jpg', caption: '商學大樓建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'civil', imageUrl: '/photos/civil.webp', caption: '土木水利館建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'xuesi', imageUrl: '/photos/xuesi.jpg', caption: '學思樓建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'engineering', imageUrl: '/photos/engineering.webp', caption: '工程與科技相關建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'zhongqin', imageUrl: '/photos/zhongqin.jpg', caption: '忠勤樓建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'science', imageUrl: '/photos/science.webp', caption: '理學大樓建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'science-aero', imageUrl: '/photos/science-aero.jpg', caption: '科學與航太館建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'activity', imageUrl: '/photos/activity.webp', caption: '育樂館建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'admin', imageUrl: '/photos/admin.jpg', caption: '行政大樓建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'admin-2', imageUrl: '/photos/admin-2.jpg', caption: '行政二館建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'language', imageUrl: '/photos/language.webp', caption: '語文大樓建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'ciee', imageUrl: '/photos/ciee.webp', caption: '資訊電機館建築實景', credit: '本專案建築照片資料庫' },
  { placeId: 'sports', imageUrl: '/photos/sports.webp', caption: '體育館建築實景', credit: '本專案建築照片資料庫' }
]

export const sources = [
  { label: '逢甲大學校園地圖', url: 'https://www.fcu.edu.tw/map/' },
  { label: '逢甲大學官網', url: 'https://www.fcu.edu.tw/' },
  { label: '逢甲大學圖書館', url: 'https://web.lib.fcu.edu.tw/library' },
  { label: 'Wikimedia Commons 校園照片', url: 'https://commons.wikimedia.org/wiki/Category:Feng_Chia_University' }
]
