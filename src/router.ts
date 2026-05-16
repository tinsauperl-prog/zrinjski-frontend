import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Treneri from './views/Treneri.vue'
import Grupe from './views/Grupe.vue'
import Plivaci from './views/Plivaci.vue'
import Termini from './views/Termini.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/treneri', component: Treneri },
  { path: '/grupe', component: Grupe },
  { path: '/plivaci', component: Plivaci },
  { path: '/termini', component: Termini }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router