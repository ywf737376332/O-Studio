/**
 * 路由列表：
 *      title:         页面标题
 *      icon：         组件图标
 *      languageType： 页面语言类型
 *      affix：        是否固定
 *      noAuth：       是否未授权
 */
const routes = [
  {
    path: '/home',
    name: 'Home',
    meta: { title: '首页', icon: 'icon-home', affix: true, visible: false  },
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/menus',
    name: 'Menus',
    meta: { title: '全部菜单', icon: 'icon-func-list', visible: false },
    component: () => import('@/views/menus/index.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { title: '系统设置', icon: 'icon-settings', affix: false, visible: false  },
    component: () => import('@/views/settings/index.vue')
  },
  {
    path: '/jsontools',
    name: 'JsonTools',
    meta: { title: 'JSON编辑器', icon: 'icon-json', languageType: 'JSON', affix: false, visible: true },
    component: () => import('@/views/pages/jsontools/index.vue')
  },
  {
    path: '/xmltools',
    name: 'XmlTools',
    meta: { title: 'XML编辑器', icon: 'icon-xml', languageType: 'XML' },
    component: () => import('@/views/pages/xmltools/index.vue')
  },
  {
    path: '/sqltools',
    name: 'SqlTools',
    meta: { title: 'SQL编辑器', icon: 'icon-sql', languageType: 'SQL' },
    component: () => import('@/views/pages/sqltools/index.vue')
  },
  {
    path: '/jsonconvertxml',
    name: 'JsonConvertXml',
    meta: { title: 'JSON XML互转', icon: 'icon-json-xml', languageType: 'JSON' },
    component: () => import('@/views/pages/jsonconvertxml/index.vue')
  },
  {
    path: '/jsonconvertyaml',
    name: 'JsonConvertYaml',
    meta: { title: 'JSON YAML互转', icon: 'icon-json-yaml', languageType: 'JSON' },
    component: () => import('@/views/pages/jsonconvertyaml/index.vue')
  },
  {
    path: '/jsonconvertjavascript',
    name: 'JsonConvertJavaScript',
    meta: { title: 'JSON JavaScript互转', icon: 'icon-json-javascript', languageType: 'JSON' },
    component: () => import('@/views/pages/jsonconvertjavascript/index.vue')
  },
  {
    path: '/urlparse',
    name: 'UrlParse',
    meta: { title: 'URL解析器', icon: 'icon-url-parse' },
    component: () => import('@/views/pages/urlparse/index.vue')
  },
  {
    path: '/timestampTools',
    name: 'TimestampTools',
    meta: { title: '时间戳转换', icon: 'icon-timestamp' },
    component: () => import('@/views/pages/timestamptools/index.vue')
  },
  {
    path: '/hexcodec',
    name: 'Hexcodec',
    meta: { title: 'Hex编码解码', icon: 'icon-hex', noAuth: false },
    component: () => import('@/views/pages/hexcodec/index.vue')
  },
  {
    path: '/base64text',
    name: 'Base64Text',
    meta: { title: 'Base64文本', icon: 'icon-base64-text', noAuth: false },
    component: () => import('@/views/pages/base64text/index.vue')
  },
  {
    path: '/base64img',
    name: 'Base64Img',
    meta: { title: 'Base64图像', icon: 'icon-base64-img', noAuth: false },
    component: () => import('@/views/pages/base64img/index.vue')
  },
  {
    path: '/unicodecodec',
    name: 'UnicodeCodec',
    meta: { title: 'Unicode编解码', icon: 'icon-cn-unicode' },
    component: () => import('@/views/pages/unicodecodec/index.vue')
  },
  {
    path: '/decimalconvert',
    name: 'DecimalConvert',
    meta: { title: '进制转换', icon: 'icon-decimal-convert' },
    component: () => import('@/views/pages/decimalconvert/index.vue')
  },
  {
    path: '/qrcodeview',
    name: 'QrcodeView',
    meta: { title: '二维码解析', icon: 'icon-qrcode', noAuth: false },
    component: () => import('@/views/pages/qrcodeview/index.vue')
  },
  {
    path: '/wordscount',
    name: 'WordsCount',
    meta: { title: '字数统计', icon: 'icon-words-count' },
    component: () => import('@/views/pages/wordscount/index.vue')
  },
  {
    path: '/imgwatermark',
    name: 'ImgWaterMark',
    meta: { title: '图片水印', icon: 'icon-img-watermark' },
    component: () => import('@/views/pages/imgwatermark/index.vue')
  },
  {
    path: '/codecopy',
    name: 'CodeCopy',
    meta: { title: '代码小抄', icon: 'icon-code-copy' },
    component: () => import('@/views/pages/codecopy/index.vue')
  },
  {
    path: '/gzipandunzip',
    name: 'GzipAndUnzip',
    meta: { title: '文本 压缩/解压缩', icon: 'icon-text-gzip' },
    component: () => import('@/views/pages/gzipandunzip/index.vue')
  }
]

export default routes
