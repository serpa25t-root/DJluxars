import { Toaster } from 'react-hot-toast'

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: 'rgba(24, 24, 27, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#ffffff',
          border: '1px solid rgba(63, 63, 70, 0.6)',
          borderRadius: '16px',
          padding: '14px 18px',
          fontSize: '13px',
          fontWeight: 500,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(220, 38, 38, 0.08)',
          maxWidth: '340px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#064e3b',
          },
          style: {
            borderLeft: '3px solid #10b981',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#450a0a',
          },
          style: {
            borderLeft: '3px solid #ef4444',
          },
        },
        loading: {
          iconTheme: {
            primary: '#f59e0b',
            secondary: '#451a03',
          },
          style: {
            borderLeft: '3px solid #f59e0b',
          },
        },
      }}
    />
  )
}

export default ToastProvider
