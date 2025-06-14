<template>
    <div class="bg-[#060606] h-screen text-white">
        <div class="px-20 pb-20 pt-10">
            <nav class="flex justify-between items-center py-4 border-b border-b-white/15">
                <div>
                    <router-link to="/" class="hover:text-blue-300 transition-colors">Home</router-link>
                </div>
                
                <!-- Navigation links - only show when authenticated -->
                <div v-if="authStore.isLoggedIn" class="space-x-6 font-bold">
                    <router-link to="/surveys" class="hover:text-blue-300 transition-colors">Surveys</router-link>
                    <router-link to="/profile" class="hover:text-blue-300 transition-colors">Profile</router-link>
                    <router-link to="/settings" class="hover:text-blue-300 transition-colors">Settings</router-link>
                </div>

                <!-- Auth section -->
                <div class="space-x-6 font-bold">
                    <!-- Show login when not authenticated -->
                    <router-link 
                        v-if="!authStore.isLoggedIn" 
                        to="/login" 
                        class="hover:text-blue-300 transition-colors"
                    >
                        Login
                    </router-link>
                    
                    <!-- Show user info and logout when authenticated -->
                    <template v-else>
                        <button 
                            @click="handleLogout"
                            class="hover:text-red-300 transition-colors"
                            :disabled="authStore.loading"
                        >
                            {{ authStore.loading ? 'Logging out...' : 'Logout' }}
                        </button>
                    </template>
                </div>
            </nav>

            <main class="mt-10 max-w-[986px] mx-auto">
                <!-- Show loading state during auth initialization -->
                <div v-if="!authStore.initialized" class="text-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p class="mt-2">Loading...</p>
                </div>
                
                <!-- Show content when initialized -->
                <div v-else>
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Use setup syntax instead of options API to avoid re-instantiation
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  const result = await authStore.logout()
  if (result.success) {
    router.push('/login')
  }
}
</script>