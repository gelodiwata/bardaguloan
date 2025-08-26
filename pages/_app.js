import '@/styles/globals.css'
import '@/styles/animations.css'
import { ToastProvider } from '../contexts/ToastContext'

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  )
}
