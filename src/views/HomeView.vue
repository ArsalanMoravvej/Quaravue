<script setup>
import mainLayout from '@/components/layout/mainLayout.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
    <mainLayout>
        <div class="space-y-6">
            <h2 class="text-2xl font-bold">Welcome to Home Page {{ authStore.user?.name }}</h2>
            
            <!-- Now you can access auth data -->
            <div v-if="authStore.user" class="bg-white/10 rounded-xl p-6">
                <h3 class="text-xl font-semibold mb-4">User Information</h3>
                <p><strong>Name:</strong> {{ authStore.user?.name }}</p>
                <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
                <p><strong>ID:</strong> {{ authStore.user?.id }}</p>
            </div>

            <!-- Show loading state -->
            <div v-if="authStore.loading" class="text-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                <p class="mt-2">Loading...</p>
            </div>

            <!-- Show authentication status -->
            <div class="bg-green-500/20 border border-green-500 rounded-xl p-4">
                <p class="text-green-200">
                    Authentication Status: {{ authStore.isLoggedIn ? 'Logged In' : 'Not Logged In' }}
                </p>
            </div>

            <!-- Access computed getters -->
            <div v-if="authStore.isLoggedIn" class="space-y-2">
                <p>You have access to protected features!</p>
                <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                    Access Protected Feature
                </button>
            </div>
        </div>
    </mainLayout>
</template>