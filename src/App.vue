<template>
  <div id="app">
    <div class="topbar">
      <ApplyChange />
      <UserInfo></UserInfo>
      <h3>I2G Workspace Sharing</h3>
    </div>
    <div class="main-body">
      <div class="side-pane">
        <div class="v-title-outer"><div class='v-title-inner'>Projects</div></div>
        <ProjectList :style-obj="{'flex': 1, display: 'flex', flexDirection: 'column', 'overflow': 'hidden'}"></ProjectList>
      </div>
      <!--<div class="content">
        <div class="v-title-outer">
          <div class='v-title-inner'>Configuration</div>
        </div>
        <ShareConfig />
      </div>-->
      <div class="side-pane" style="flex: 1; border-left: 1px solid #ccf">
        <div class="v-title-outer">
          <div class='v-title-inner'>Users</div>
        </div>
        <UserList :style-obj="{'flex': 1, display: 'flex', flexDirection: 'column', 'overflow': 'hidden'}" />
      </div>
    </div>
  </div>
</template>

<script>
import ApplyChange from './components/ApplyChange.vue'
import UserInfo from './components/UserInfo.vue'
import ProjectList from './components/ProjectList.vue'
// import ShareConfig from './components/ShareConfig.vue'
import UserList from './components/UserList.vue'

export default {
  name: 'App',
  components: {
    UserInfo, ProjectList, ApplyChange, UserList
  },
  mounted() {
    console.log('mounted');
    this.$store.dispatch('fetchState', this.$dtoast);
  }
}
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.topbar {
  position: relative;
  background: #1962a7;
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  height: 41px;
  border-bottom: none;
  color: white;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
}
h4, h3 {
  display: inline-block;
  font-family: serif !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.main-body {
  flex: 1; 
  overflow: hidden;
  display: flex;
}
.side-pane {
  flex-basis: 40%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.v-title-outer {
  height: 40px;
  position: relative;
  border-bottom: 1px solid #ddf;
}
.v-title-inner {
  font-size: 16px;
  font-weight: 600;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
}
.content {
  flex: 1;
  overflow: auto;
  border-right: 1px solid #ccf;
  border-left: 1px solid #ccf;
}
</style>
