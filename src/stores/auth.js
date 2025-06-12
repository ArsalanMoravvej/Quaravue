// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

// Configure axios defaults
axios.defaults.baseURL = 'http://quaravel.test'
axios.defaults.withCredentials = true

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false // Track if we've done initial auth check
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post('/api/login', {
          email: credentials.email,
          password: credentials.password
        }, { withCredentials: true })

        // Fix: Use consistent token property
        this.user = response.data.data.user
        this.token = response.data.data.access_token
        this.isAuthenticated = true


        console.log(this.user.name)

        // Store token in localStorage
        localStorage.setItem('auth_token', this.token)
        
        // Set default authorization header (fix: use correct token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true, user: this.user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        
        if (error.response?.data?.errors) {
          this.error = Object.values(error.response.data.errors).flat().join(', ')
        }

        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true

      try {
        await axios.post('/api/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Always clear state regardless of API success
        this.user = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('auth_token')
        delete axios.defaults.headers.common['Authorization']
        this.loading = false
      }

      return { success: true }
    },

    // Improved: Check auth with whoami endpoint
    async checkAuth() {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        this.initialized = true
        return false
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Use your whoami endpoint
        const response = await axios.get('/api/whoami')
        
        this.user = response.data.data.user // Adjust based on your API response
        this.token = token
        this.isAuthenticated = true
        this.initialized = true

        return true
      } catch (error) {
        // Token is invalid, clear everything
        this.clearAuth()
        return false
      }
    },

    // Initialize auth state on app startup
    async initializeAuth() {
      if (this.initialized) return

      this.loading = true
      try {
        await this.checkAuth()
      } finally {
        this.loading = false
        this.initialized = true
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('auth_token')
      delete axios.defaults.headers.common['Authorization']
      this.initialized = true
    },

    clearError() {
      this.error = null
    }
  }
})