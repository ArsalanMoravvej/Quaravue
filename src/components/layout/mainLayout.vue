<template>
    <div class="bg-[#060606] h-screen text-white">

        <div class=" px-20 pb-20 pt-10">
            <nav class="flex justify-between items-center py-4 border-b border-b-white/15">
            
                <div>
                    <router-link to="/" class="hover:text-blue-300 transition-colors">Home</router-link>
                </div>
                
                <div class="space-x-6 font-bold">
                    <router-link to="#" class="hover:text-blue-300 transition-colors">Link 1</router-link>
                    <router-link to="#" class="hover:text-blue-300 transition-colors">Link 2</router-link>
                    <router-link to="#" class="hover:text-blue-300 transition-colors">Link 3</router-link>
                    <router-link to="#" class="hover:text-blue-300 transition-colors">Link 4</router-link>
                </div>

                <div class="space-x-6 font-bold">
                    <router-link to="/login" class="hover:text-blue-300 transition-colors">Login</router-link>
                </div>

            </nav>

            <main class="mt-10 max-w-[986] mx-auto">
                <slot></slot>
            </main>
        </div>


    </div>

</template>


<script>
export default {
  name: 'mainLayout'
}
</script>