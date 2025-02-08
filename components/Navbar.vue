<template>
  <nav class="bg-slate-200 border-b border-gray-200 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="h-16 flex items-center">
        <div class="flex items-center gap-2">
          <img src="/images/icon.png" alt="BFF Logo" class="h-12 w-12" />
          <span class="text-2xl text-black tracking-wider">BFF Dog Finder</span>
        </div>
        <div class="ml-auto flex items-center gap-4">
          <button
            @click="logout"
            class="p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-300 flex items-center justify-center"
            title="Log out"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const api = useApi()
const router = useRouter()
const toast = useToast()

const logout = async () => {
  try {
    await api.post('/auth/logout', {})
    router.push('/')
  } catch (error) {
    toast.add({
      title: 'Logout Failed',
      description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      color: 'red'
    })
  }
}
</script> 