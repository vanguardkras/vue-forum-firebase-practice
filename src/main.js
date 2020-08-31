import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import AppDate from '@/components/AppDate'
import store from '@/store'
import firebase from 'firebase/app'

Vue.component('AppDate', AppDate)

Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCGuj-d6k5BbhCHGab1Cxu5DznAHFaKV8o',
  authDomain: 'vueforum-53d25.firebaseapp.com',
  databaseURL: 'https://vueforum-53d25.firebaseio.com',
  projectId: 'vueforum-53d25',
  storageBucket: 'vueforum-53d25.appspot.com',
  messagingSenderId: '807740470643',
  appId: '1:807740470643:web:65255833ad3bb315d8c106'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')

