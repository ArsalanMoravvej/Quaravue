// src/router/index.js
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SurveysView from '@/views/SurveysView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { 
        requiresGuest: true // Only accessible when NOT logged in
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { 
        requiresAuth: true // Requires authentication
      }
    },
    {
      path: '/surveys',
      name: 'surveys',
      component: SurveysView,
      meta: { 
        requiresAuth: true 
      }
    }
  ]
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth if not already done
  if (!authStore.initialized) {
    await authStore.initializeAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !authStore.isLoggedIn) {
    // Redirect to login if trying to access protected route while not authenticated
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (requiresGuest && authStore.isLoggedIn) {
    // Redirect to home if trying to access guest-only route while authenticated
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router