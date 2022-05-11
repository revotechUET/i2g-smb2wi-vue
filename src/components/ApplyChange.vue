<template>
  <div style="flex: 1">
    <div v-show="hasChanges" class="call-to-action" @click="applyChanges">Apply Changes</div>
    <v-dialog style="color: initial;" />
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
      if(!(await new Promise(resolve => {
        this.$modal.show('dialog', {
          class: 'confirm-dialog',
          title: 'Confirmation',
          text: 'Are you sure to apply changes',
          buttons: [
            {
              title: 'Cancel',
              handler: () => {
                resolve(false)
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Ok',
              handler: () => {
                resolve(true)
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      }))) return
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
::v-deep .confirm-dialog div {
  font-size: 14px;
}
</style>
