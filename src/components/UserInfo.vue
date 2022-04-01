<template>
  <div>
    <span><i class="fa fa-user"></i></span><span>{{company || 'N/A'}}/{{username || 'N/A'}}</span>
    <span style="cursor: pointer" @click="$store.dispatch('logout')"><i class='fa fa-power-off'></i></span>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: "UserInfo",
  computed: {
    ...mapState(['username', 'company']),
  }
}
</script>
<style scoped>
div {
  display: inline-block;
}
span {
  margin: 0 3px;
}
</style>
