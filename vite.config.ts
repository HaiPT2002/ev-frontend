import { defineConfig } from 'vite'

// Some environments cannot require ESM-only plugins synchronously. Use dynamic import
// and export a Promise resolving to the config so Vite can load ESM plugins safely.
const configPromise = (async () => {
  const { default: react } = await import('@vitejs/plugin-react')
  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173
    }
  })
})()

export default configPromise
