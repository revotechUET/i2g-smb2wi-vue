<template>
  <div :style="styleObj" :class="classObj" class="position-relative">
    <input class="input-filter" type="text" v-model="filterValue" placeholder="Search users">
    <ul v-if='shareState(selectedProject)'>
      <li :class="{'shared': shared2All }" class="hover-active" @click="toggleAll">
        <i class="fa fa-users fa-big-icon"></i><span style="margin-left: 10px">[ ALL ]</span>
      </li>
      <li v-for="u in filterUsers" :key="u.idUser"
        :class="{'shared': shareUser(u) }" class="hover-active inline-block w-200" @click="$store.commit('selectedShareToggleUser', u)">
        <i class="fa fa-user-circle-o fa-big-icon"></i><span style="margin-left: 10px">{{u.username}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import {normalize} from '../accessors.js'
export default {
  name: "UserList",
  props: [ 'styleObj', 'classObj' ],
  data() {
    return { filterValue: "", shared2All: false }
  },
  computed: {
    ...mapState(['users', 'selectedProjectIdx', 'projects']),
    ...mapGetters(['shareState' ]),
    selectedProject() {
      return this.projects[this.selectedProjectIdx];
    },
    filterUsers() {
      if (!this.filterValue || !this.filterValue.length) return this.users;
      return this.users.filter(u => u.username.includes(this.filterValue));
    },
    validUsers() {
      if (!this.selectedProject) return [];
      let selectedShareState = this.shareState(this.selectedProject);
      if (!selectedShareState) return [];
      return selectedShareState.data.validUsers;
    }
  },
  methods: {
    shareUser(user) {
      if (!this.selectedProject || !user) return null;
      let validUsers = ( this.shareState( (this.selectedProject) ) || {data: {validUsers:[]}} ).data.validUsers;
      return validUsers.find(vUser => vUser === normalize(user.username));
    },
    toggleAll() {
      if (this.shared2All) {
        for (let u of this.filterUsers) {
          this.$store.commit('selectedShareUnshareToUser', u);
        }
      }
      else {
        for (let u of this.filterUsers) {
          this.$store.commit('selectedShareShareToUser', u);
        }
      }
      this.shared2All = !this.shared2All;
    }
  }
}
</script>
<style>
</style>
