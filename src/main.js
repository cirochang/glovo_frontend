import Vue from 'vue';

// CSS imports
import './assets/sass/main.scss';

import App from './App.vue';

// Instantiate application to the DOM
const app = new Vue({
  el: '#app',
  render: h => h(App),
});
