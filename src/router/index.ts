import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/product',
      name: 'Product',
      component: () => import('../views/ProductListView.vue'),
    },

    {
      name: 'AddProduct',
      path: '/product/create',
      component: () => import('../views/EditProductView.vue'),
    },
    {
      name: 'EditProduct',
      path: '/product/:slug/edit',
      component: () => import('../views/EditProductView.vue'),
    },
    {
      path: '/subscriptions',
      name: 'Subscriptions',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MailListView.vue'),
    },
    {
      name: 'AddSubscription',
      path: '/subscriptions/add',
      component: () => import('../views/EditSubscription.vue'),
    },
  ]
})

export default router
