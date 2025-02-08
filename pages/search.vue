<template>
  <div class="container mx-auto p-4">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mt-4 mb-2">Find Your Perfect Companion</h1>
      <p class="text-gray-400 max-w-2xl">
        Browse through our available dogs, favorite the ones you love, and let our matching system 
        help you find your ideal furry friend. Use the filters below to narrow your search by breed 
        and sort the results to your preference.
      </p>
    </div>

    <!-- Search Controls -->
    <div class="mb-6 flex gap-4 items-center justify-end">
      <div class="flex flex-col gap-1">
        <span class="text-sm text-gray-400">Filter available breeds</span>
        <USelectMenu
          v-model="selectedBreeds"
          :options="breeds"
          placeholder="Filter by breeds"
          multiple
          class="w-64"
        >
          <template #label>
            <span v-if="selectedBreeds.length === 0">Select breeds</span>
            <span v-else>{{ selectedBreeds.length }} breeds selected</span>
          </template>
        </USelectMenu>
      </div>
      
      <div class="flex flex-col gap-1">
        <span class="text-sm text-gray-400">Age range (years)</span>
        <div class="flex gap-2 items-center">
          <UInput
            v-model="ageMin"
            type="number"
            min="1"
            max="30"
            placeholder="Min"
            class="w-20"
          />
          <span class="text-gray-400">to</span>
          <UInput
            v-model="ageMax"
            type="number"
            min="1"
            max="30"
            placeholder="Max"
            class="w-20"
          />
        </div>
      </div>
      
      <div class="flex flex-col gap-1">
        <span class="text-sm text-gray-400">Sort breeds by name</span>
        <USelect
          v-model="sortDirection"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' }
          ]"
          class="w-48"
        />
      </div>
    </div>

    <!-- Results Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <UCard 
        v-for="dog in dogs" 
        :key="dog.id" 
        class="relative h-full"
        :ui="{
          base: 'h-full flex flex-col justify-between bg-white shadow-lg',
          background: 'bg-white',
          ring: '',
          divide: 'divide-gray-100',
        }"
      >
        <div class="flex items-center justify-center h-64 overflow-hidden">
          <img 
            :src="dog.img" 
            :alt="dog.breed" 
            class="w-full h-full object-cover rounded-t"
          >
        </div>
        
        <template #footer>
          <div class="p-4">
            <h3 class="text-xl font-bold mb-2">{{ dog.name }}</h3>
            <p class="text-sm text-gray-400">{{ dog.breed }}</p>
            <p class="text-sm text-gray-400">{{ dog.age }} years old</p>
            <p class="text-sm text-gray-400">ZIP Location: {{ dog.zip_code }}</p>

            <button 
              class="absolute bottom-4 right-4 cursor-pointer transition-colors h-8 w-8"
              @click="toggleFavorite(dog.id)"
            >
              <Icon 
                :name="favorites.includes(dog.id) 
                  ? 'heroicons:heart-solid' 
                  : 'heroicons:heart'"
                class="h-8 w-8 stroke-2"
                :class="favorites.includes(dog.id) 
                  ? 'text-pink-400' 
                  : 'text-gray-400 hover:text-pink-400'"
              />
            </button>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <UPagination
        v-model="currentPage"
        :total="total"
        :page-count="25"
      />
      
      <UButton
        color="primary"
        :disabled="favorites.length === 0"
        @click="generateMatch"
      >
        Find a match ({{ favorites.length }} selected)
      </UButton>
    </div>

    <!-- Match Modal -->
    <UModal v-model="showMatchModal">
      <UCard 
        v-if="matchedDog"
        :ui="{
          base: 'bg-white shadow-lg',
          background: 'bg-white',
          ring: '',
          divide: 'divide-gray-100',
        }"
      >
        <template #header>
          <h3 class="text-lg font-bold">Your Perfect Match!</h3>
        </template>
        
        <img 
          :src="matchedDog.img" 
          :alt="matchedDog.breed" 
          class="w-full h-full object-cover rounded-t"
        >
        <div class="p-4">
          <h4 class="text-xl font-bold">{{ matchedDog.breed }}</h4>
          <p>Age: {{ matchedDog.age }} years</p>
          <p>ZIP Location: {{ matchedDog.zip_code }}</p>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Dog, SearchResponse, MatchResponse } from '~/types/index'

const api = useApi()
const toast = useToast()

// State
const dogs = ref<Dog[]>([])
const breeds = ref<{ label: string; value: string }[]>([])
const selectedBreeds = ref<{ label: string; value: string }[]>([])
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const total = ref(1)
const favorites = ref<string[]>([])
const showMatchModal = ref(false)
const matchedDog = ref<Dog | null>(null)
const ageMin = ref<string>('')
const ageMax = ref<string>('')

// Fetch breeds for filter
const fetchBreeds = async () => {
  try {
    const data = await api.get<string[]>('/dogs/breeds')
    breeds.value = data.map((breed: string) => ({ label: breed, value: breed }))
  } catch (error) {
    console.error('Error fetching breeds:', error)
    addToastError('Failed to load breed filters. Please refresh the page.')
  }
}

// Fetch dogs based on filters
const fetchDogs = async () => {
  try {
    const params = new URLSearchParams({
      from: ((currentPage.value-1)*25).toString(),
      sort: `breed:${sortDirection.value}`
    })
    
    if (ageMin.value) {
      params.append('ageMin', ageMin.value)
    }

    if (ageMax.value) {
      params.append('ageMax', ageMax.value)
    }

    if (selectedBreeds.value?.length) {
      selectedBreeds.value.forEach((breed: { value: string }) => {
        params.append('breeds[]', breed.value)
      })
    }

    const data = await api.get<SearchResponse>(`/dogs/search?${params.toString()}`)
    total.value = Math.ceil(data.total)

    const dogsData = await api.post<Dog[]>('/dogs', data.resultIds)
    dogs.value = dogsData
  } catch (error) {
    console.error('Error fetching dogs:', error)
    addToastError('Failed to load available dogs. Please refresh the page.')
  }
}

// Toggle favorite status
const toggleFavorite = (dogId: string) => {
  const index = favorites.value.indexOf(dogId)
  if (index === -1) {
    favorites.value.push(dogId)
  } else {
    favorites.value.splice(index, 1)
  }
}

// Generate match
const generateMatch = async () => {
  try {
    const data = await api.post<MatchResponse>('/dogs/match', favorites.value)
    const dogData = await api.post<Dog[]>('/dogs', [data.match])
    matchedDog.value = dogData[0]
    showMatchModal.value = true
  } catch (error) {
    console.error('Error generating match:', error)
    addToastError('Failed to find your perfect match. Please try again.')
  }
}

// Add toast error
const addToastError = (description: string) => {
  toast.add({
    description,
    color: 'red'
  })
}

// Custom debounce function
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  onUnmounted(() => {
    if (timeout) clearTimeout(timeout)
  })
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

// Watch for immediate filter changes
watch([selectedBreeds, sortDirection, currentPage], () => {
  fetchDogs()
})

// Debounced watch for age inputs to avoid concurrent requests
watch([ageMin, ageMax], 
  debounce(() => {
    fetchDogs()
  }, 200)
)

// Add validation for age inputs
watch([ageMin, ageMax], () => {
  const min = Number(ageMin.value)
  const max = Number(ageMax.value)
  if (min > max && max !== 0) {
    addToastError('Minimum age cannot be greater than maximum age')
    ageMin.value = ''
  }
})

// Initial load
onMounted(() => {
  fetchBreeds()
  fetchDogs()
})
</script> 