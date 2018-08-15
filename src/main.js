// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import GoogleAuth from 'vue-google-oauth'
import VueResource from 'vue-resource'

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

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
