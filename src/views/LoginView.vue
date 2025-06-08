<script>
import mainLayout from '@/components/layout/mainLayout.vue';
import Heading from '@/components/ui/Heading.vue';

export default {
  components: {
    mainLayout,
    Heading
  }
}

</script>

<template>
    <mainLayout>
        <Heading>Login</Heading>

        <form @submit.prevent="handleLogin" class="max-w-2xl mx-auto space-y-6" action="/login" method="POST">
            
        

                <div class="inline-flex items-center gap-x-2">
                    <span class="w-2 h-2 bg-white inline-block"></span>
                    <label class="font-bold" for="email">Email</label>
                </div>


                <input class="mt-1 rounded-xl bg-white/10 border border-white/10 px-5 py-4 w-full" type="email" name="email" id="">


                <div class="inline-flex items-center gap-x-2">
                    <span class="w-2 h-2 bg-white inline-block"></span>
                    <label class="font-bold" for="password">Password</label>
                </div>

                <input class="mt-1 rounded-xl bg-white/10 border border-white/10 px-5 py-4 w-full" type="password" name="password" id="">

                
                <button class="mt-2 bg-blue-800 rounded py-2 px-6 font-bold">Log in</button>

            
        </form>
    </mainLayout>
</template>

