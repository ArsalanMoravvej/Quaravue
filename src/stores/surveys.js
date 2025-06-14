// src/stores/surveys.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useSurveysStore = defineStore('surveys', {
  state: () => ({
    surveys: [],
    currentSurvey: null,
    loading: false,
    error: null,
    initialized: false
  }),

  getters: {
    getSurveyById: (state) => (id) => {
      return state.surveys.find(survey => survey.id === id)
    },
    surveysCount: (state) => state.surveys.length
  },

  actions: {
    // Fetch all surveys
    async fetchSurveys() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('/api/v1/surveys')
        this.surveys = response.data.data || response.data
        this.initialized = true
        return { success: true, data: this.surveys }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch surveys'
        console.error('Fetch surveys error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Fetch single survey
    async fetchSurvey(id) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(`/api/v1/surveys/${id}`)
        this.currentSurvey = response.data.data || response.data
        return { success: true, data: this.currentSurvey }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch survey'
        console.error('Fetch survey error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Create new survey
    async createSurvey(surveyData) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post('/api/v1/surveys', {
          title: surveyData.title,
          language: surveyData.language || 'fa',
          active: surveyData.active
        })
        const newSurvey = response.data.data || response.data
        
        // Add to local surveys array
        this.surveys.unshift(newSurvey)
        
        return { success: true, data: newSurvey }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create survey'
        
        if (error.response?.data?.errors) {
          this.error = Object.values(error.response.data.errors).flat().join(', ')
        }
        
        console.error('Create survey error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Update survey
    async updateSurvey(id, surveyData) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.patch(`/api/v1/surveys/${id}`, {
          title: surveyData.title,
          language: surveyData.language || 'fa',
          active: surveyData.active
        })
        const updatedSurvey = response.data.data || response.data
        
        // Update in local surveys array
        const index = this.surveys.findIndex(survey => survey.id === id)
        if (index !== -1) {
          this.surveys[index] = updatedSurvey
        }
        
        // Update current survey if it's the one being edited
        if (this.currentSurvey && this.currentSurvey.id === id) {
          this.currentSurvey = updatedSurvey
        }
        
        return { success: true, data: updatedSurvey }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update survey'
        
        if (error.response?.data?.errors) {
          this.error = Object.values(error.response.data.errors).flat().join(', ')
        }
        
        console.error('Update survey error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Delete survey
    async deleteSurvey(id) {
      this.loading = true
      this.error = null

      try {
        await axios.delete(`/api/v1/surveys/${id}`)
        
        // Remove from local surveys array
        this.surveys = this.surveys.filter(survey => survey.id !== id)
        
        // Clear current survey if it was the deleted one
        if (this.currentSurvey && this.currentSurvey.id === id) {
          this.currentSurvey = null
        }
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete survey'
        console.error('Delete survey error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Clear current survey
    clearCurrentSurvey() {
      this.currentSurvey = null
    },

    // Reset store
    resetStore() {
      this.surveys = []
      this.currentSurvey = null
      this.loading = false
      this.error = null
      this.initialized = false
    }
  }
})