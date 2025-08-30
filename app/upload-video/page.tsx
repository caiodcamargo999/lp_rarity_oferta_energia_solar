'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function UploadVideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo primeiro')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadedUrl(result.url)
        setError('')
      } else {
        setError(result.error || 'Erro no upload')
      }
    } catch (err) {
      setError('Erro ao fazer upload do arquivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Upload do Vídeo para Vercel Storage
          </h1>

          <div className="space-y-6">
            {/* Seleção de Arquivo */}
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer block"
              >
                <div className="text-gray-400 mb-4">
                  {file ? file.name : 'Clique para selecionar o vídeo'}
                </div>
                <div className="text-sm text-gray-500">
                  {file ? `Tamanho: ${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'MP4, MOV, AVI até 100MB'}
                </div>
              </label>
            </div>

            {/* Botão de Upload */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              {uploading ? 'Fazendo Upload...' : 'Fazer Upload'}
            </button>

            {/* URL do Vídeo */}
            {uploadedUrl && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2">✅ Upload Concluído!</h3>
                <p className="text-green-300 text-sm mb-2">URL do vídeo:</p>
                <input
                  type="text"
                  value={uploadedUrl}
                  readOnly
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(uploadedUrl)}
                  className="mt-2 text-green-400 hover:text-green-300 text-sm"
                >
                  📋 Copiar URL
                </button>
              </div>
            )}

            {/* Erro */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">❌ {error}</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>⚠️ Após o upload, copie a URL e configure no seu projeto</p>
            <p>🔧 Use a URL na variável de ambiente NEXT_PUBLIC_VIDEO_URL</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
