import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
// import Home from '../views/Home'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
