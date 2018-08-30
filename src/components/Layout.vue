<template>
  <div>
    <div class="container container-table">
      <div>layout</div>
      <div>
        <b-button @click="showModal">
          Open Modal
        </b-button>
        <b-modal ref="myModalRef" hide-footer title="Using Component Methods">
          <div class="d-block text-center">
            <h3>Hello From My Modal!</h3>
          </div>
          <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-btn>
        </b-modal>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'layout',
  mounted: function () {
    this.onload()
  },
  methods: {
    onload: function () {
      console.log('Layout loaded!')
    },
    showModal () {
      this.$refs.myModalRef.show()
    },
    hideModal () {
      this.$refs.myModalRef.hide()
    }
  }
}
</script>
<style>

</style>


