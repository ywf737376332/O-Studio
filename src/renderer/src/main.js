import { createApp } from 'vue'
import App from './App.vue'

// 引入elementUi
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入暗黑主题
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 引入自定义样式
import './assets/index.scss'

// 引入阿里图标库
import './assets/icon/iconfont.css'

// 引入pinia
import pinia from './store'
// 引入路由
import router from '@/router'

const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn
})
app.use(pinia)
app.use(router)

app.mount('#app');
