<template>
  <div style="flex: 1">
    <div v-show="hasChanges" class="call-to-action" @click="applyChanges">Apply Changes</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: "ApplyChange",
  computed: {
    ...mapState(['shareStates', 'shareStatesBk']),
    hasChanges() {
      return (this.shareStates.length !== this.shareStatesBk.length) || (JSON.stringify(this.shareStates) !== JSON.stringify(this.shareStatesBk))
    }
  },
  methods : {
    async applyChanges() {
      console.log('Apply changes');
      this.$store.dispatch('loadState', this.$dtoast);
    }
  }
}
</script>
<style scoped>
.call-to-action {
  display: inline-block;
  font-weight: 600;
  font-size: 14px;
  line-height: 4;
  /*backdrop-filter: brightness(1.3);*/
  background-color: #E05050;
  padding: 0 1em;
  cursor: pointer;
}
</style>
