export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || ''
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'BFF Dog Finder',
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/icon.png' }
      ]
    }
  }
})
