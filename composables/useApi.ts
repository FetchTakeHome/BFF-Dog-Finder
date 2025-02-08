export const useApi = () => {
  const config = useRuntimeConfig()
  const toast = useToast()
  const router = useRouter()

  const handleUnauthorized = () => {
    toast.add({
      title: 'Your session has expired. Please log in again.',
      color: 'red'
    })
    router.push('/')
    throw new Error('Unauthorized')
  }

  const get = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${config.public.apiBase}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 401) {
      handleUnauthorized()
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data as T
  }

  const post = async <T>(endpoint: string, body: unknown): Promise<T> => {
    if (!endpoint.startsWith('/')) {
      throw new Error('Endpoint must start with /')
    }

    const response = await fetch(`${config.public.apiBase}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 401) {
      handleUnauthorized()
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return data as T
    }
    
    return { message: 'OK' } as T
  }

  return {
    get,
    post,
  }
}