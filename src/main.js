import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import AppDate from '@/components/AppDate'
import store from '@/store'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

Vue.component('AppDate', AppDate)

Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch('fetchAuthUser')
  }
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')

