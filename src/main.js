import { createApp } from 'vue'
import App from './App.vue'
import frontRouter from './router/frontRouter'
import { createPinia } from 'pinia'

const app = createApp(App)

// Pinia 스토어 사용 설정
app.use(createPinia())

// 라우터 사용 설정
app.use(frontRouter)

// Vue 애플리케이션 마운트
app.mount('#app')
