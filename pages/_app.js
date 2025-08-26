import '@/styles/globals.css'
import '@/styles/animations.css'
import { useEffect } from 'react'
import { ToastProvider } from '../contexts/ToastContext'
import { registerServiceWorker } from '../lib/pwa'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  )
}
