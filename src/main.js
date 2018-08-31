// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import GoogleAuth from 'vue-google-oauth'
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import VuePictureSwipe from 'vue-picture-swipe'
import VueAgile from 'vue-agile'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import the styles directly. (Or you could add them via script tags.)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(GoogleAuth, {
  client_id: '402271985389-atpk31e9attb5s1vbs0u38dunn5uoah9.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/drive ' +
          'https://www.googleapis.com/auth/drive.appdata ' +
          'https://www.googleapis.com/auth/drive.file ' +
          'https://www.googleapis.com/auth/drive.metadata ' +
          'https://www.googleapis.com/auth/drive.metadata.readonly ' +
          'https://www.googleapis.com/auth/drive.photos.readonly ' +
          'https://www.googleapis.com/auth/drive.readonly ' +
          'https://www.googleapis.com/auth/drive.scripts'
})
Vue.googleAuth().load()
Vue.use(VueResource)
library.add(fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(BootstrapVue)
Vue.use(VueAgile)
Vue.component('vue-picture-swipe', VuePictureSwipe)
Vue.config.productionTip = false

const axios = require('axios')

/* ===========================================
              GLOBAL GUARDS
 =========================================== */

// GLobal BEFORE hooks:
router.beforeEach((to, from, next) => {
  console.log('Global -- beforeEach - fired')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!localStorage.getItem('access_token')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + localStorage.getItem('access_token')).then(function () {
        next()
      }).catch(function () {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      })
    }
  } else {
    next() // make sure to always call next()!
  }
})

// Global beforeResolve
router.beforeResolve((to, from, next) => {
  console.log('Global -- beforeResolve - fired.')
  next()
})

// GLobal AFTER hooks:
router.afterEach((to, from) => {
  // This fires after each route is entered.
  console.log(`Global -- afterEach - Just moved from '${from.path}' to '${to.path}'`)
})

// Register an Error Handler:
router.onError(err => {
  console.error('Handling this error', err.message)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
