// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

// Configure axios defaults
axios.defaults.baseURL = 'http://quaravel.test' // Your Laravel API URL
axios.defaults.withCredentials = true // Important for cookies

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      
      

      try {
        const csrf = await axios.get("/csrf-token", { withCredentials: true })

        const response = await axios.post('/api/login', {
          _token : csrf.data.csrf_token,
          email: credentials.email,
          password: credentials.password
        },
        { withCredentials: true }
      )



        this.user = response.data.data.user
        this.token = response.data.data.access_token
        this.isAuthenticated = true

        // Store token in localStorage as backup
        localStorage.setItem('auth_token', this.token)
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

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
        await axios.post('/logout')
        
        this.user = null
        this.token = null
        this.isAuthenticated = false

        // Clear stored token
        localStorage.removeItem('auth_token')
        delete axios.defaults.headers.common['Authorization']

        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)
        // Force logout even if API call fails
        this.user = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('auth_token')
        delete axios.defaults.headers.common['Authorization']

        return { success: true }
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        return false
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await axios.get('/user')
        
        this.user = response.data.user
        this.token = token
        this.isAuthenticated = true

        return true
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token')
        delete axios.defaults.headers.common['Authorization']
        this.user = null
        this.token = null
        this.isAuthenticated = false

        return false
      }
    },

    clearError() {
      this.error = null
    }
  }
})