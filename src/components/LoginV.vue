<template>
  <div id="loginPage">
    <div v-if="!agileLoad" class="loading">Loading...</div>
    <div v-if="agileLoad">
      <agile v-if="agileLoad" :options="agileOpt">
        <div v-for="item in slideImages" :key="item.id" class="slide" :style="{'background-image':'url(https://docs.google.com/uc?id=' + item.id + ')'}"></div>
      </agile>
      <div class="login--container">
        <div class="login--form">
          <div class="login--form--title">
            <span>Welcome to</span>
            <img src="https://www.opusbank.com/themes/opusbank/assets/images/merchant-banking/logos/nhf.png" alt="" width="70%">
          </div>
          <div class="login--form--btn google--btn" v-on:click="signIn">
            <div class="google--btn--icon">
              <font-awesome-icon :icon="['fab', 'google']"/>
            </div>
            <div class="google--btn--text">Sign in with Google</div>
          </div>
        </div>
      </div>
    </div>
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
      this.agileLoad = false
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
      this.agileLoad = true
      if (this.$route.query.redirect) {
        router.push(this.$route.query.redirect)
      } else {
        router.push({name: 'home'})
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
  }
  .login {
    &--container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #0000007a;
      color: white;
    }
    &--form {
      text-align: center;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 100%;
      width: 100%;
      &--title {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 40px;
        max-width: 70%;
        text-shadow: 0px 3px 15px rgba(150, 150, 150, 0.5);
      }
      &--btn {
        &.google--btn {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 10px 25px;
          background-color: red;
          cursor: pointer;
          border-radius: 100px;
          max-width: 60%;
          * {
            margin-right: 10px;
            &:last-child {
              margin: 0;
            }
            &.google--btn--text {
              font-weight: 500;
            }
          }
        }
      }
    }
  }
</style>

