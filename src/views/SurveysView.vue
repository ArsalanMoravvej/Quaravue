<template>
    <mainLayout>
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold">My Surveys</h2>
                <button 
                    @click="showCreateModal = true"
                    class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                    + Create Survey
                </button>
            </div>

            <!-- Error message -->
            <div v-if="surveysStore.error" class="bg-red-500/20 border border-red-500 rounded-xl px-4 py-3 text-red-200">
                {{ surveysStore.error }}
                <button @click="surveysStore.clearError()" class="ml-2 text-red-300 hover:text-red-100">×</button>
            </div>

            <!-- Loading state -->
            <div v-if="surveysStore.loading && !surveys.length" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p class="mt-2">Loading surveys...</p>
            </div>

            <!-- Empty state -->
            <div v-else-if="!surveysStore.loading && surveys.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-xl font-semibold mb-2">No surveys yet</h3>
                <p class="text-gray-400 mb-4">Create your first survey to get started</p>
                <button 
                    @click="showCreateModal = true"
                    class="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                    Create Your First Survey
                </button>
            </div>

            <!-- Surveys grid -->
            <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div 
                    v-for="survey in surveys" 
                    :key="survey.id"
                    class="bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-colors cursor-pointer"
                    @click="goToSurvey(survey.id)"
                >
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-semibold truncate">{{ survey.title || 'Untitled Survey' }}</h3>
                        <div class="flex space-x-2" @click.stop>
                            <button 
                                @click="editSurvey(survey)"
                                class="text-blue-400 hover:text-blue-300 p-1"
                                title="Edit"
                            >
                                ✏️
                            </button>
                            <button 
                                @click="confirmDelete(survey)"
                                class="text-red-400 hover:text-red-300 p-1"
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                    
                    <div class="space-y-2 mb-4">
                        <div class="text-sm text-gray-300">
                            <span class="font-semibold">Code:</span> {{ survey.public_code }}
                        </div>
                        <div class="text-sm text-gray-300">
                            <span class="font-semibold">Language:</span> {{ survey.language?.toUpperCase() }}
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span 
                            class="px-3 py-1 rounded-full text-xs font-semibold"
                            :class="survey.active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'"
                        >
                            {{ survey.active ? 'Active' : 'Inactive' }}
                        </span>
                        <span class="text-xs text-gray-400">Click to manage</span>
                    </div>
                </div>
            </div>

            <!-- Create/Edit Modal -->
            <div 
                v-if="showCreateModal || showEditModal" 
                class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                @click.self="closeModals"
            >
                <div class="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md mx-4">
                    <h3 class="text-xl font-bold mb-4">
                        {{ showEditModal ? 'Edit Survey' : 'Create New Survey' }}
                    </h3>
                    
                    <form @submit.prevent="showEditModal ? updateSurvey() : createSurvey()" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Title</label>
                            <input 
                                v-model="form.title"
                                type="text" 
                                class="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                                placeholder="Enter survey title"
                                required
                            >
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold mb-2">Language</label>
                            <select 
                                v-model="form.language"
                                class="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                            >
                                <option value="fa">Persian (فارسی)</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold mb-2">Status</label>
                            <div class="flex items-center space-x-3">
                                <label class="flex items-center cursor-pointer">
                                    <input 
                                        v-model="form.active"
                                        type="radio"
                                        :value="true"
                                        class="text-green-500 focus:ring-green-500"
                                    >
                                    <span class="ml-2 text-green-300">Active</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input 
                                        v-model="form.active"
                                        type="radio"
                                        :value="false"
                                        class="text-gray-500 focus:ring-gray-500"
                                    >
                                    <span class="ml-2 text-gray-300">Inactive</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="flex space-x-3 pt-4">
                            <button 
                                type="submit"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-colors"
                                :disabled="surveysStore.loading"
                            >
                                {{ surveysStore.loading ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
                            </button>
                            <button 
                                type="button"
                                @click="closeModals"
                                class="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div 
                v-if="showDeleteModal" 
                class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                @click.self="showDeleteModal = false"
            >
                <div class="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-sm mx-4">
                    <h3 class="text-xl font-bold mb-4 text-red-400">Delete Survey</h3>
                    <p class="mb-6">
                        Are you sure you want to delete "{{ surveyToDelete?.title }}"? This action cannot be undone.
                    </p>
                    <div class="flex space-x-3">
                        <button 
                            @click="deleteSurvey"
                            class="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition-colors"
                            :disabled="surveysStore.loading"
                        >
                            {{ surveysStore.loading ? 'Deleting...' : 'Delete' }}
                        </button>
                        <button 
                            @click="showDeleteModal = false"
                            class="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </mainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import mainLayout from '@/components/layout/mainLayout.vue'
import { useSurveysStore } from '@/stores/surveys'

const surveysStore = useSurveysStore()
const router = useRouter()

// Reactive state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const surveyToDelete = ref(null)
const editingSurvey = ref(null)

const form = ref({
  title: '',
  language: 'fa',
  active: true
})

// Computed
const surveys = computed(() => surveysStore.surveys)

// Methods
const loadSurveys = async () => {
  if (!surveysStore.initialized) {
    await surveysStore.fetchSurveys()
  }
}

const createSurvey = async () => {
  const result = await surveysStore.createSurvey({
    title: form.value.title,
    language: form.value.language,
    active: form.value.active
  })
  
  if (result.success) {
    closeModals()
    resetForm()
  }
}

const editSurvey = (survey) => {
  editingSurvey.value = survey
  form.value = {
    title: survey.title || '',
    language: survey.language || 'fa',
    active: survey.active
  }
  showEditModal.value = true
}

const updateSurvey = async () => {
  if (!editingSurvey.value) return
  
  const result = await surveysStore.updateSurvey(editingSurvey.value.id, {
    title: form.value.title,
    language: form.value.language,
    active: form.value.active
  })
  
  if (result.success) {
    closeModals()
    resetForm()
  }
}

const goToSurvey = (surveyId) => {
  router.push(`/surveys/${surveyId}`)
}

const confirmDelete = (survey) => {
  surveyToDelete.value = survey
  showDeleteModal.value = true
}

const deleteSurvey = async () => {
  if (!surveyToDelete.value) return
  
  const result = await surveysStore.deleteSurvey(surveyToDelete.value.id)
  
  if (result.success) {
    showDeleteModal.value = false
    surveyToDelete.value = null
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingSurvey.value = null
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    language: 'fa',
    active: true
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return ''
  }
}

// Lifecycle
onMounted(() => {
  loadSurveys()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>