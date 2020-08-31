import Vue from 'vue'
import VueRouter from 'vue-router'
import PageThreadShow from '@/views/PageThreadShow'
import Home from '@/views/PageHome'
import NotFound from '@/views/PageNotFound'
import Forum from '@/views/PageForum'
import Category from '@/views/PageCategory'
import Profile from '@/views/PageProfile'
import ThreadCreate from '@/views/PageThreadCreate'
import ThreadEdit from '@/views/PageThreadEdit'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/thread/create/:forumId',
        name: 'ThreadCreate',
        component: ThreadCreate,
        props: true
    },
    {
        path: '/thread/:id/edit',
        name: 'ThreadEdit',
        component: ThreadEdit,
        props: true
    },
    {
        path: '/thread/:id',
        name: 'ThreadShow',
        component: PageThreadShow,
        props: true
    },
    {
        path: '*',
        name: 'NotFound',
        component: NotFound,

    },
    {
        path: '/forum/:id',
        name: 'Forum',
        component: Forum,
        props: true

    },
    {
        path: '/category/:id',
        name: 'Category',
        component: Category,
        props: true

    },
    {
        path: '/me',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/me/edit',
        name: 'ProfileEdit',
        component: Profile,
        props: {
            edit: true
        }
    }
    /*{
      path: '/thread',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: function () {
        return import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
      }
    }*/
]

const router = new VueRouter({
    //mode: 'history',
    routes
})

export default router
