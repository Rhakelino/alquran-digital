import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

function PWAInstallPrompt() {
  const {
    offlineReady,
    needRefresh,
    updateServiceWorker
  } = useRegisterSW()

  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setShowPrompt(true)
    }
  }, [offlineReady, needRefresh])

  const handleInstall = () => {
    if (needRefresh) {
      updateServiceWorker(true)
    }
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className={`
      fixed bottom-4 left-4 right-4 
      bg-black text-white 
      p-4 rounded-lg 
      shadow-2xl z-50
    `}>
      <div className="flex justify-between items-center">
        <p>
          {needRefresh 
            ? 'Pembaruan tersedia. Perbarui sekarang?' 
            : 'Aplikasi siap digunakan offline'}
        </p>
        <div className="flex space-x-2">
          {needRefresh && (
            <button 
              onClick={() => setShowPrompt(false)}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              Nanti
            </button>
          )}
          <button 
            onClick={handleInstall}
            className="bg-blue-600 px-3 py-1 rounded"
          >
            {needRefresh ? 'Perbarui' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt