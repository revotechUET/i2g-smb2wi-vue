<template>
  <div :class='classObj' class="position-relative" :style='styleObj'>
    <input class="input-filter" type="text" v-model="filterValue" placeholder="Search workspace">
    <div class="project-list">
      <table>
        <thead>
          <tr>
            <th>Workspace</th>
            <th style="width: 60%;">Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p,idx) in filterProjects" :key="idx"
            :class="{'selected': selectedProjectIdx === idx, 'shared': shareState(p) }"
            @click="$store.commit('selectPrjIndex', idx)">
            <td><i class="fa fa-sitemap fa-big-icon"></i><span style="margin-left:10px;">{{p.name}}</span></td>
            <td>
              <input v-if='shareState(p)' type="text" :value="`\\\\hcm-dtpappserv.biendongpoc.vn\\codb_${normalizedUsername}_${p.name}`"
                readonly style="width: 100%; border: 0; outline: 0; background: none; font-style: italic; font-weight: 300"
                @click="e => e.currentTarget.select()">
            </td>
            <td style="width: 80px">
              <button @click="doUnshare(p)"
                v-show='selectedProjectIdx === idx && shareState(p)' style="width: 100%">Unshare</button>
              <button @click="doShare(p)"
                v-show='selectedProjectIdx === idx && !shareState(p)' style="width: 100%">Share</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { storageDBKey, normalize } from '../accessors.js';
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
    normalizedUsername() {
      return normalize(this.$store.state.username);
    },
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
