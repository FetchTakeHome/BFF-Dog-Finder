<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-800">
    <!-- Welcome Header -->
    <div class="text-center mb-8 max-w-2xl">
      <h1 class="text-4xl font-bold text-white mb-4">Welcome to BFF Dog Finder</h1>
      <p class="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
        Your journey to finding the perfect furry best friend starts here!
        <br>
        Simply log in with your name and email to start browsing through our wonderful dogs and discover your perfect match.
      </p>
    </div>


    <!-- Login Card -->
    <UCard 
      class="w-full max-w-md"
      :ui="{
        base: 'bg-white shadow-lg',
        background: 'bg-white',
        ring: '',
        divide: 'divide-gray-100',
      }"
    >
      <template #header>
        <h2 class="text-xl font-bold">Login</h2>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UFormGroup label="Name">
          <UInput v-model="name" placeholder="Enter your name" />
        </UFormGroup>

        <UFormGroup label="Email">
          <UInput 
            v-model="email" 
            type="email" 
            placeholder="Enter your email"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="primary"
          block
        >
          Start Finding Your BFF
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const router = useRouter()
const toast = useToast()

const name = ref('')
const email = ref('')

interface LoginResponse {
  token: string
}

const handleLogin = async () => {
  if (!name.value || !email.value) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in all fields',
      color: 'red'
    })
    return
  }

  try {
    const data = await api.post<LoginResponse>('/auth/login', {
      name: name.value,
      email: email.value
    })
    if (data) {
      router.push('/search')
    }
  } catch (error) {
    toast.add({
      title: 'Login Failed',
      description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      color: 'red'
    })
  }
}
</script>

