import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//  routes
import router from "./router";
// element-plus组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'



const app = createApp(App)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
