<template>
  <div class="container container-table">
    <!-- Errors -->
    <!-- <div v-if=response class="text-red"><p>{{response}}</p></div> -->
    <iframe id="my_iframe" style="display:none;"></iframe>
    <!-- login Button -->
    <a id="signin-button" v-on:click="signIn">
      <i class="fa fa-google-plus-official fa-3x"></i>
      Sign in with Google
    </a>
    <a v-on:click="getDrive()">
      <i class="fa fa-google-plus-official fa-3x"></i>
      Get drive
    </a>
    <a id="signin-button" v-on:click="signOut">
      <i class="fa fa-google-plus-official fa-3x"></i>
      Sign out with Google
    </a>
    <a id="signin-button" v-on:click="nextPage">
      <i class="fa fa-google-plus-official fa-3x"></i>
      Next
    </a>
    <a id="signin-button" v-on:click="goParent">
      <i class="fa fa-google-plus-official fa-3x"></i>
      goParent
    </a>
    <button type="button" class="btn btn-primary">Primary</button>

    <div v-on:click="checkauthen">check authen</div>

    <vue-picture-swipe v-if=listFiles :options="{shareButtons: [{id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}],}" :items="listFiles"></vue-picture-swipe>
  </div>
</template>

<script>
import Vue from 'vue'
import router from '../router'
export default {
  name: 'login',
  data: (router) => {
    return {
      section: 'Login',
      loading: '',
      response: '',
      access_token: '',
      listFiles: '',
      urlDrive: 'https://content.googleapis.com/drive/v2/files/',
      urlDownload: '',
      urlNext: ''
    }
  },
  methods: {
    checkauthen: function () {
      this.access_token = localStorage.getItem('access_token')
      this.$http.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + this.access_token).then(res => console.log(res))
    },
    getDrive: function (id) {
      this.access_token = localStorage.getItem('access_token')
      if (!id) {
        if (localStorage.getItem('currentID')) {
          id = localStorage.getItem('currentID')
        } else {
          id = 'root'
        }
      } else {
        this.$http.get(this.urlDrive + id + '?fields=title,%20parents(id)&access_token=' + this.access_token).then(res => {
          localStorage.setItem('parentID', res.body.parents[0].id)
          console.log(res.body)
        }, res => {
          console.log('err: ', res)
        })
      }
      localStorage.setItem('currentID', id)
      var params = [
        {'orderBy': 'folder'},
        {'maxResults': 100},
        {'q': '\'' + id + '\' in parents and trashed=false'},
        {'fields': 'nextPageToken, items(id, title, mimeType, thumbnailLink, downloadUrl, iconLink, imageMediaMetadata(width, height), videoMediaMetadata)'}
      ]
      params = params.map(function (key) {
        return Object.keys(key).concat(Object.values(key)).join('=')
      })
      var uri = encodeURI(params.join('&'))
      this.$http.get(this.urlDrive + '?' + uri + '&access_token=' + this.access_token).then(res => {
        console.log('data: ', res.body)
        this.listFiles = res.body.items.map((item) => {
          var obj = {
            id: item.id,
            title: item.title,
            mimeType: item.mimeType,
            thumbnail: item.thumbnailLink,
            src: item.downloadUrl + '&access_token=' + this.access_token,
            w: item.imageMediaMetadata.width,
            h: item.imageMediaMetadata.height,
            iconLink: item.iconLink,
            videoMediaMetadata: item.videoMediaMetadata
          }
          console.log(obj)
          return obj
        })
        console.log(this.listFiles)
        this.urlNext = res.body.nextLink
      }, res => {
        console.log('err: ', res)
      })
    },
    goParent: function () {
      this.getDrive(localStorage.getItem('parentID'))
    },
    checkType: function (id, type, downloadUrl) {
      if (type === 'application/vnd.google-apps.folder') {
        this.getDrive(id)
      } else if (type === 'image/jpeg') {
        document.getElementById('my_iframe').src = downloadUrl + '&access_token=' + this.access_token
      }
    },
    nextPage: function () {
      this.$http.get(this.urlNext + '&access_token=' + this.access_token).then(res => {
        console.log('data: ', res.body)
        this.listFiles = res.body.items
        // this.urlNext = res.body.nextLink
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
