<template>
  <div :class='classObj' class="position-relative" :style='styleObj'>
    <input class="input-filter" type="text" v-model="filterValue" placeholder="Search project">
    <ul>
      <li v-for="(p,idx) in filterProjects" :key="idx" style="display:flex;"
        :class="{'selected': selectedProjectIdx === idx, 'shared': shareState(p) }"  
        @click="$store.commit('selectPrjIndex', idx)">
        <div style="flex: 2;"><i class="fa fa-sitemap fa-big-icon"></i><span style="margin-left:10px;">{{p.name}}</span></div>
        <div style="flex: 3; font-style: italic; font-weight: 300"><span v-if='shareState(p)'>{{`codb_${username}_${p.name}`}}</span></div>
        <div style="flex-basis: 80px">
          <button @click="doUnshare(p)"
            v-show='selectedProjectIdx === idx && shareState(p)' style="width: 100%">Unshare</button>
          <button @click="doShare(p)"
            v-show='selectedProjectIdx === idx && !shareState(p)' style="width: 100%">Share</button>
        </div>
      </li>
    </ul>
    
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { storageDBKey } from '../accessors.js';
export default {
  name: "ProjectList",
  props: ['styleObj', 'classObj'],
  computed: {
    ...mapState({
      message: state => state.message,
      username: state => state.username,
      company: state => state.company,
      token: state => state.token,
      whoami: state => state.whoami,
      projects: state => state.projects,
      shareStates: state => state.shareStates,
      selectedProjectIdx: state => state.selectedProjectIdx
    }),
    filterProjects() {
      if (!this.filterValue || !this.filterValue.length) return this.projects;
      return this.projects.filter(p => p.name.includes(this.filterValue));
    }
  },
  methods: {
    shareState(project) {
      let shareState = this.shareStates.find(sh => sh.data.storageDBKey === storageDBKey(project));
      return shareState;
    },
    doShare(project) {
      this.$store.commit('addShare', project);
    },
    doUnshare(project) {
      this.$store.commit('removeShare', project);
    }
  },
  data() {
    return {
      filterValue: ""
    }
  }
} 
</script>
<style lang='css' scoped>
</style>
