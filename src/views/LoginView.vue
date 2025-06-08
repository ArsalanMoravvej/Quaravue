<script>
import mainLayout from '@/components/layout/mainLayout.vue';
import Heading from '@/components/ui/Heading.vue';
import { useAuthStore } from '@/stores/auth.js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    mainLayout,
    Heading
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    const form = ref({
      email: '',
      password: ''
    });

    const handleLogin = async () => {
      authStore.clearError();
      
      const result = await authStore.login({
        email: form.value.email,
        password: form.value.password
      });

      if (result.success) {
        // Redirect to home page or dashboard
        router.push('/');
      }
    };

    return {
      form,
      handleLogin,
      authStore
    };
  }
}
</script>

<template>
    <mainLayout>
        <Heading>Login</Heading>

        <form @submit.prevent="handleLogin" class="max-w-2xl mx-auto space-y-6">
            
            <!-- Error message -->
            <div v-if="authStore.error" class="bg-red-500/20 border border-red-500 rounded-xl px-4 py-3 text-red-200">
                {{ authStore.error }}
            </div>

            <div class="space-y-2">
                <div class="inline-flex items-center gap-x-2">
                    <span class="w-2 h-2 bg-white inline-block"></span>
                    <label class="font-bold" for="email">Email</label>
                </div>
                <input 
                    v-model="form.email"
                    class="mt-1 rounded-xl bg-white/10 border border-white/10 px-5 py-4 w-full focus:outline-none focus:border-blue-400 transition-colors" 
                    type="email" 
                    name="email" 
                    id="email"
                    required
                    :disabled="authStore.loading"
                >
            </div>

            <div class="space-y-2">
                <div class="inline-flex items-center gap-x-2">
                    <span class="w-2 h-2 bg-white inline-block"></span>
                    <label class="font-bold" for="password">Password</label>
                </div>
                <input 
                    v-model="form.password"
                    class="mt-1 rounded-xl bg-white/10 border border-white/10 px-5 py-4 w-full focus:outline-none focus:border-blue-400 transition-colors" 
                    type="password" 
                    name="password" 
                    id="password"
                    required
                    :disabled="authStore.loading"
                >
            </div>

            <button 
                type="submit"
                class="mt-6 bg-blue-800 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed rounded-xl py-3 px-8 font-bold transition-colors w-full"
                :disabled="authStore.loading"
            >
                {{ authStore.loading ? 'Logging in...' : 'Log in' }}
            </button>
        </form>
    </mainLayout>
</template>