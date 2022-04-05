import Vue from 'vue';
import Vuex from 'vuex';
import jwt_decode from 'jwt-decode';
import axios from 'axios'
import { storageDBKey, sharePath, shareName, normalize } from './accessors.js';
Vue.use(Vuex);
const { wiLoginClient, WiApi, wiid } = require('@revotechuet/misc-component-vue');
const wiLogin = new wiLoginClient('WI_SMB2WI_CLIENT');
window.localStorage.setItem('AUTHENTICATION_SERVICE', 'https://users.i2g.cloud');
window.localStorage.setItem('BASE_URL', 'https://users.i2g.cloud');
wiLogin.doLogin({ redirectUrl: window.location.origin, whoami: 'wi-angular', loginPage: 'https://login.i2g.cloud' });

function queryShares(url, token, storageDBKeys) {
  return axios.request({
    method: 'POST',
    url,
    headers: {
      Authorization: token,
      ContentType: 'application/json'
    },
    data: storageDBKeys,
    params: {
      token: token
    }
  });
}
function loadShares(url, token, storageDBKeys, shares) {
  return axios.request({
    method: 'POST',
    url,
    headers: {
      Authorization: token,
      ContentType: 'application/json'
    },
    data: {
      storageDBKeys, shares
    },
    params: { token }
  });
}
function listUsers(idCompany, token) {
  let payload = { idCompany };
  let payloadHash = wiid(payload, token);
  return axios.request({
    method: 'POST',
    url: window.localStorage.getItem('AUTHENTICATION_SERVICE') + '/user/list',
    data: { idCompany },
    headers: {
      Authorization: token,
      ContentType: 'application/json',
      Service: 'WI_AUTH',
      WHOAMI: 'WI_ANGULAR'
    },
    params: {
      wiid: payloadHash
    }
  });
}
let store = new Vuex.Store({
  state() {
    return {
      message: "hello. This is vuex store",
      token: "",
      username: "",
      company: "",
      whoami: "",
      projects: [],
      users: [],
      shareStates: [],
      shareStatesBk: [],
      selectedProjectIdx: -1
    }
  },
  mutations: {
    newMessage(state) {
      state.message = "HELLO. THIS IS NEW MESSAGE"
    },
    setLoginInfo(state, { username, company, token, whoami }) {
      state.username = username;
      state.company = company;
      state.token = token;
      state.whoami = whoami;
    },
    setProjectList(state, prjs) {
      state.projects = prjs;
    },
    addProjectInfo(state, info) {
      state.projects.push(info);
    },
    selectPrjIndex(state, selectedIndex) {
      state.selectedProjectIdx = selectedIndex;
    },
    setShareStates(state, shareStates) {
      state.shareStates = shareStates;
      state.shareStatesBk = JSON.parse(JSON.stringify(shareStates));
    },
    setUsers(state, users) {
      state.users = users;
    },
    addShare(state, project) {
      state.shareStates.push({
        comment: JSON.stringify({owner: normalize(state.username), storageDBKey: storageDBKey(project)}),
        path: sharePath(project),
        'read only': 'No',
        'browseable': 'No',
        'public': 'No',
        'hide files': '/*__WI__/',
        data: {
          name: shareName(project, normalize(state.username)),
          owner: normalize(state.username),
          storageDBKey: storageDBKey(project),
          validUsers: []
        }
      });
    },
    removeShare(state, project) {
      let idx = state.shareStates.findIndex(sh => sh.data.storageDBKey === storageDBKey(project));
      console.log(idx, state.shareStates, project);
      if (idx >= 0) {
        state.shareStates.splice(idx, 1);
      }
    },
    selectedShareToggleUser(state, user) {
      let selectedProject = state.projects[state.selectedProjectIdx];
      if ( !selectedProject ) return;
      let selectedShareState = state.shareStates.find(sh => sh.data.storageDBKey === storageDBKey(selectedProject));
      if ( !selectedShareState ) return;
      let validUsers = selectedShareState.data.validUsers;
      let idx = validUsers.findIndex(vUser => vUser === normalize(user.username));
      if (idx < 0) {
        validUsers.push(normalize(user.username));
      }
      else {
        validUsers.splice(idx, 1);
      }
    },
    selectedShareShareToUser(state, user) {
      let selectedProject = state.projects[state.selectedProjectIdx];
      if ( !selectedProject ) return;
      let selectedShareState = state.shareStates.find(sh => sh.data.storageDBKey === storageDBKey(selectedProject));
      if ( !selectedShareState ) return;
      let validUsers = selectedShareState.data.validUsers;
      let idx = validUsers.findIndex(vUser => vUser === normalize(user.username));
      if (idx < 0) {
        validUsers.push(normalize(user.username));
      }
    },
    selectedShareUnshareToUser(state, user) {
      let selectedProject = state.projects[state.selectedProjectIdx];
      if ( !selectedProject ) return;
      let selectedShareState = state.shareStates.find(sh => sh.data.storageDBKey === storageDBKey(selectedProject));
      if ( !selectedShareState ) return;
      let validUsers = selectedShareState.data.validUsers;
      let idx = validUsers.findIndex(vUser => vUser === normalize(user.username));
      if (idx >= 0) {
        validUsers.splice(idx, 1);
      }
    }
  },
  getters: {
    getProject: state => (idProject) => {
      return state.projects.find(p => p.idProject === idProject);
    },
    shareState: state => (project) => {
      if (!project) return null;
      return state.shareStates.find(sh => sh.data.storageDBKey === storageDBKey(project));
    },
  },
  actions: {
    fetchState: async function(context, $dtoast) {
      let token = localStorage.getItem('token');
      let decoded = jwt_decode(token);
      context.commit('setLoginInfo', {token, ...decoded});
      try {
        let prjs = await WiApi.getListProjects();
        prjs = prjs.filter(p => !p.shared);
        for (let p of prjs) {
          let info = await WiApi.getFullInfoPromise(p.idProject);
          context.commit('addProjectInfo', info);
        }
        let shareStates = (await queryShares('/api/query-shares', context.state.token, context.state.projects.map(p => storageDBKey(p)))).data.data;
        context.commit('setShareStates', shareStates);
        let company = JSON.parse(window.localStorage.getItem('company'));
        let users = (await listUsers(company.idCompany, context.state.token)).data.content;
        console.log(users);
        context.commit('setUsers', users.filter(u => u.username.startsWith('bdpoc_')));
      }
      catch(e) {
        console.error(e);
        $dtoast.pop({
          preset: 'error',
          heading: 'Error',
          content: e.response.data
        });
      }
    },
    loadState: async function(context, $dtoast) {
      try {
        let storageDBKeys = context.state.projects.map(p => storageDBKey(p));
        let shares = context.state.shareStates;
        let response = await loadShares('/api/load-shares', context.state.token, storageDBKeys, shares);
        context.commit('setShareStates', response.data.data);
      }
      catch(e) {
        console.error(e);
        $dtoast.pop({
          preset: 'error',
          heading: 'Error',
          content: e.response.data
        });
        return;
      }
    },
    logout() {
      wiLogin.logout({ redirectUrl: window.location.origin, whoami: 'wi-smb2wi', loginPage: 'https://login.i2g.cloud' });
      window.localStorage.clear();
    }
  }
});
export default store
