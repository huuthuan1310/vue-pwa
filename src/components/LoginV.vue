<template>
  <div id="loginPage">
    {{agileLoad}}
    <agile v-if="agileLoad" :options="agileOpt">
      <div v-for="item in slideImages" :key="item.id" class="slide slide---1" :style="{'background-image':'url(https://docs.google.com/uc?id=' + item.id + ')'}"></div>
    </agile>
  </div>
</template>

<script>
import Vue from 'vue'
import router from '../router'
export default {
  name: 'loginv',
  data: () => {
    return {
      section: 'Login',
      loading: '',
      response: '',
      access_token: '',
      listFiles: '',
      urlDrive: 'https://content.googleapis.com/drive/v2/files/',
      urlDownload: '',
      urlNext: '',
      slideImages: [],
      apiKey: 'AIzaSyBM2GycmDQRd5OM4aQXb5MOglLo3fQEbJM',
      agileOpt: {
        arrows: false,
        autoplay: true,
        fade: true,
        dots: false,
        timing: 'linear',
        speed: 2000
      },
      agileLoad: false
    }
  },
  methods: {
    getImage: function () {
      var params = [
        {'orderBy': 'folder'},
        {'maxResults': 100},
        {'q': '\'1mbU6xxzZbVU5hk9PkrfcxM-3MHozEqQr\' in parents and trashed=false'},
        {'fields': 'items(id)'}
      ]
      params = params.map(function (key) {
        return Object.keys(key).concat(Object.values(key)).join('=')
      })
      var uri = encodeURI(params.join('&'))
      this.$http.get(this.urlDrive + '?' + uri + '&key=' + this.apiKey).then(res => {
        console.log(res.body)
        this.slideImages = res.body.items
        this.agileLoad = true
      }, res => {
        console.log('err: ', res)
      })
    },
    signIn: function () {
      // Just add in this line
      Vue.googleAuth().directAccess()
      Vue.googleAuth().signIn(this.onSignInSuccess, this.onSignInError)
    },
    signOut: function () {
      Vue.googleAuth().signOut(function () {
        localStorage.clear()
        // things to do when sign-out succeeds
      }, () => {
        // things to do when sign-out fails
      })
    },
    onSignInSuccess: function (authorizationCode) {
      // this.toggleLoading()
      // this.resetResponse()
      localStorage.setItem('access_token', authorizationCode.Zi.access_token)
      if (this.$route.query.redirect) {
        router.push(this.$route.query.redirect)
      }
    },
    onSignInError: function (error) {
      this.response = 'Failed to sign-in'
      console.log('GOOGLE SERVER - SIGN-IN ERROR', error)
    },
    toggleLoading: function () {
      this.loading = (this.loading === '') ? 'loading' : ''
    },
    resetResponse: function () {
      this.response = ''
    }
  },
  created () {
    this.getImage()
  },
  beforeRouteEnter (to, from, next) {
    console.log('Enter component login')
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    next()
  },
  beforeRouteUpdate (to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
    console.log('update component login')
    next()
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    console.log('Leave')
    next()
  }
}
</script>
<style lang="scss">
.slide {
    background: {
      position: center;
      size: cover;
    }
    height: 100vh;
    &:before {
        background-color: rgba(#000, .2);
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    &--1 {
      background-image: url(https://lukaszflorczak.github.io/vue-agile/static/img/bg-07.3a19e81.jpg);
    }

    &--2 {
      background-image: url(https://lukaszflorczak.github.io/vue-agile/static/img/bg-08.c43e689.jpg);
    }

    &--3 {
      background-image: url(https://lukaszflorczak.github.io/vue-agile/static/img/bg-09.e55cb0a.jpg);
    }
  }
</style>

