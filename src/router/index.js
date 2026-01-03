import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/pending-orders',
    children: [
      {
        path: 'pending-orders',
        name: 'PendingOrders',
        component: () => import('../views/PendingOrders.vue'),
        meta: { title: '待接订单' }
      },
      {
        path: 'order-detail/:orderId',
        name: 'OrderDetail',
        component: () => import('../views/OrderDetail.vue'),
        meta: { title: '订单详情' }
      },
      {
        path: 'history-orders',
        name: 'HistoryOrders',
        component: () => import('../views/HistoryOrders.vue'),
        meta: { title: '历史订单' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { title: '个人信息' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const workerToken = localStorage.getItem('worker_token')
  
  if (to.path === '/login') {
    next()
  } else {
    if (workerToken) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
