<template>
  <form>
    <div>
      <input type="checkbox" v-model="shared" /><label>Shared</label>
    </div>
    <div>
      <label>Shared</label><input type="text" v-model="shareName" />
    </div>
  </form>
</template>
<script>
export default {
  name: "ShareConfig",
  data: function() {
    return {
      shared: true,
      shareName: 'codb_xxx_yyy'
    }
  }
}
</script>
<style scoped>
</style>
