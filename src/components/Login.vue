<template>
  <div class="container container-table">
    <!-- Errors -->
    <!-- <div v-if=response class="text-red"><p>{{response}}</p></div> -->

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
    <table v-if=listFiles>
      <tr>
        <td>id</td>
        <td>name</td>
        <td>type</td>
        <td></td>
      </tr>
      <tr v-for="(item, index) in listFiles" :key="index">
        <td><a href="#" v-on:click="checkType(item.id, item.mimeType, item.downloadUrl)">{{item.id}}</a></td>
        <td>{{item.name}}</td>
        <td>{{item.mimeType}}</td>
        <td><img v-if="item.mimeType === 'image/jpeg'" width="100" v-bind:src="item.thumbnailLink"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
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
      urlDownload: ''
    }
  },
  methods: {
    getDrive: function (id) {
      if (!id) {
        id = ''
      }
      this.access_token = localStorage.getItem('access_token')
      this.$http.get(this.urlDrive + id + '?access_token=' + this.access_token).then(res => {
        console.log('data: ', res.body)
        this.listFiles = res.body.items
      }, res => {
        console.log('err: ', res)
      })
    },
    checkType: function (id, type, downloadUrl) {
      if (type === 'application/vnd.google-apps.folder') {
        this.getDrive(id)
      } else if (type === 'image/jpeg') {
        location.pathname = downloadUrl + '&access_token=' + this.access_token
      }
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
      this.toggleLoading()
      this.resetResponse()
      localStorage.setItem('access_token', authorizationCode.Zi.access_token)
      console.log(authorizationCode)
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
  }
}
</script>
