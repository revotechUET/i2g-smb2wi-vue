import Vue from 'vue'
import 'dtoaster/dist/dtoaster.css'
import DToaster from 'dtoaster'
import axios from 'axios'
import VModal from 'vue-js-modal'
Vue.config.productionTip = false
Vue.use(DToaster, {
  presets: [ {
    "name" : "success",
    "icon" : "fa fa-check-circle",
    "icon_size" : "32px",
    "duration" : "4000",
    "background" : "rgba(32,105,156,.9)",
    "height" : "75px",
    "color" : "#FFFFFF",
    "show_progress_timeout" : "true",
    "progress_background" : "#5a9fdc",
    "progress_thumb_bg" : "rgba(32,105,156,.9)"
  }, {
    "name" : "error",
    "icon" : "fa fa-times-circle",
    "icon_size" : "32px",
    "duration" : "4000",
    "background" : "#ff1e1e",
    "height" : "75px",
    "color" : "#FFFFFF",
    "show_progress_timeout" : "true",
    "progress_background" : "rgb(255 175 175)",
    "progress_thumb_bg" : "#ff1e1e"
  } ],
  position: 'bottom-right',
  containerOffset: '45px'
});
Vue.use(VModal,  {dialog: true })
import store from './store'
import App from './App.vue'
import './styles.css';
//import './i2g-icons.css';

axios.get("/config.json", {
  headers: {
      ContentType: 'application/json'
  }
}).then(res => {
  window.$siteConfig = res.data;
  console.log(res.data);
  new Vue({
    render: h => h(App),
    store: store
  }).$mount('#app')
}).catch(e => {
  console.error(e);
  alert('failed to load Application');
});
