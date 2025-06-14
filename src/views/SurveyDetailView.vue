<template>
    <mainLayout>
        <div class="space-y-6">
            <!-- Loading state -->
            <div v-if="surveysStore.loading && !survey" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p class="mt-2">Loading survey...</p>
            </div>

            <!-- Survey not found -->
            <div v-else-if="!surveysStore.loading && !survey" class="text-center py-12">
                <div class="text-6xl mb-4">❌</div>
                <h3 class="text-xl font-semibold mb-2">Survey not found</h3>
                <p class="text-gray-400 mb-4">The survey you're looking for doesn't exist or you don't have access to it.</p>
                <router-link 
                    to="/surveys"
                    class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                    Back to Surveys
                </router-link>
            </div>

            <!-- Survey header -->
            <div v-else class="space-y-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <router-link 
                            to="/surveys"
                            class="text-gray-400 hover:text-white transition-colors"
                        >
                            ← Back to Surveys
                        </router-link>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button 
                            @click="toggleSurveyStatus"
                            class="px-4 py-2 rounded-lg font-semibold transition-colors"
                            :class="survey.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                            :disabled="surveysStore.loading"
                        >
                            {{ survey.active ? 'Deactivate' : 'Activate' }}
                        </button>
                        <button 
                            @click="openPublicLink"
                            class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                            title="Open public survey link"
                        >
                            🔗 Public Link
                        </button>
                    </div>
                </div>

                <!-- Survey info card -->
                <div class="bg-white/10 rounded-xl p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h1 class="text-3xl font-bold mb-2">{{ survey.title }}</h1>
                            <div class="flex items-center space-x-4 text-sm text-gray-300">
                                <span>
                                    <strong>Code:</strong> {{ survey.public_code }}
                                </span>
                                <span>
                                    <strong>Language:</strong> {{ survey.language?.toUpperCase() }}
                                </span>
                                <span 
                                    class="px-2 py-1 rounded-full text-xs font-semibold"
                                    :class="survey.active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'"
                                >
                                    {{ survey.active ? 'Active' : 'Inactive' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error message -->
                <div v-if="error" class="bg-red-500/20 border border-red-500 rounded-xl px-4 py-3 text-red-200">
                    {{ error }}
                    <button @click="error = null" class="ml-2 text-red-300 hover:text-red-100">×</button>
                </div>

                <!-- Questions section -->
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold">Questions</h2>
                        <button 
                            @click="createQuestion"
                            class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            + Add Question
                        </button>
                    </div>

                    <!-- Questions loading -->
                    <div v-if="questionsLoading" class="text-center py-8">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                        <p class="mt-2">Loading questions...</p>
                    </div>

                    <!-- No questions -->
                    <div v-else-if="questions.length === 0" class="text-center py-12 bg-white/5 rounded-xl">
                        <div class="text-6xl mb-4">❓</div>
                        <h3 class="text-xl font-semibold mb-2">No questions yet</h3>
                        <p class="text-gray-400 mb-4">Start building your survey by adding questions</p>
                        <button 
                            @click="createQuestion"
                            class="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Add Your First Question
                        </button>
                    </div>

                    <!-- Questions list -->
                    <div v-else class="space-y-4">
                        <div 
                            v-for="(question, index) in questions" 
                            :key="question.id"
                            class="bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-colors"
                        >
                            <div class="flex justify-between items-start mb-4">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-3 mb-2">
                                        <span class="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                                            {{ index + 1 }}
                                        </span>
                                        <span class="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                                            {{ question.type_name }}
                                        </span>
                                        <span v-if="question.answer_required" class="bg-red-600 text-white px-2 py-1 rounded text-xs">
                                            Required
                                        </span>
                                    </div>
                                    <h3 class="text-lg font-semibold mb-2">{{ question.title }}</h3>
                                    <p v-if="question.description" class="text-gray-300 text-sm mb-3">
                                        {{ question.description }}
                                    </p>
                                    
                                    <!-- Question type specific info -->
                                    <div class="text-xs text-gray-400 space-y-1">
                                        <div v-if="question.type_name === 'Text'">
                                            <span v-if="question.placeholder">Placeholder: "{{ question.placeholder }}"</span>
                                            <span v-if="question.answer_min_length || question.answer_max_length">
                                                Length: {{ question.answer_min_length || 0 }} - {{ question.answer_max_length || '∞' }} characters
                                            </span>
                                        </div>
                                        <div v-if="question.type_name === 'Numeral'">
                                            <span>{{ question.allow_decimals ? 'Decimals allowed' : 'Integers only' }}</span>
                                            <span v-if="question.number_min_value !== null || question.number_max_value !== null">
                                                Range: {{ question.number_min_value || '−∞' }} to {{ question.number_max_value || '∞' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex space-x-2">
                                    <button 
                                        @click="editQuestion(question)"
                                        class="text-blue-400 hover:text-blue-300 p-2"
                                        title="Edit question"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        @click="deleteQuestion(question)"
                                        class="text-red-400 hover:text-red-300 p-2"
                                        title="Delete question"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </mainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import mainLayout from '@/components/layout/mainLayout.vue'
import { useSurveysStore } from '@/stores/surveys'

const route = useRoute()
const router = useRouter()
const surveysStore = useSurveysStore()

// Reactive state
const questions = ref([])
const questionsLoading = ref(false)
const error = ref(null)

// Computed
const surveyId = computed(() => parseInt(route.params.id))
const survey = computed(() => surveysStore.currentSurvey)

// Methods
const loadSurvey = async () => {
  const result = await surveysStore.fetchSurvey(surveyId.value)
  if (result.success && result.data.questions) {
    questions.value = result.data.questions
  } else if (!result.success) {
    error.value = result.error
  }
}

const loadQuestions = async () => {
  questionsLoading.value = true
  error.value = null
  
  try {
    // This will be implemented when we add questions store
    // For now, questions are loaded with the survey
    console.log('Questions loaded with survey')
  } catch (err) {
    error.value = 'Failed to load questions'
    console.error('Load questions error:', err)
  } finally {
    questionsLoading.value = false
  }
}

const toggleSurveyStatus = async () => {
  if (!survey.value) return
  
  const result = await surveysStore.updateSurvey(survey.value.id, {
    title: survey.value.title,
    language: survey.value.language,
    active: !survey.value.active
  })
  
  if (!result.success) {
    error.value = result.error
  }
}

const openPublicLink = () => {
  if (!survey.value) return
  
  const publicUrl = `${window.location.origin}/s/${survey.value.public_code}`
  window.open(publicUrl, '_blank')
}

const createQuestion = () => {
  // TODO: Implement question creation modal
  alert('Question creation will be implemented in the next prompt')
}

const editQuestion = (question) => {
  // TODO: Implement question editing modal
  alert(`Edit question: ${question.title}`)
}

const deleteQuestion = (question) => {
  // TODO: Implement question deletion
  if (confirm(`Are you sure you want to delete "${question.title}"?`)) {
    alert(`Delete question: ${question.title}`)
  }
}

// Lifecycle
onMounted(() => {
  loadSurvey()
})
</script>