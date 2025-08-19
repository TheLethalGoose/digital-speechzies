import { createRouter, createWebHistory } from 'vue-router'
import MessagesView from '@/views/MessagesView.vue'

const routes = [
  { path: '/', redirect: '/thesis' },
  { path: '/:page', component: MessagesView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})