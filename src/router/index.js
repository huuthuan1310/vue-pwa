import Vue from 'vue'
import Router from 'vue-router'
const Login = () => import('@/components/Login')
const Layout = () => import('@/components/Layout')
const Home = () => import('@/components/Home')
const Album = () => import('@/components/Album')
const PageNotFound = () => import('@/components/PageNotFound')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '',
          component: Home,
          name: 'home'
        },
        {
          path: 'album',
          component: Album,
          name: 'album'
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        console.log('Entering User')
        next()
      }
    },
    {
      path: '*',
      name: 'not-found',
      component: PageNotFound
    }
  ]
})
