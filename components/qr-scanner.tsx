"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QrScannerProps {
  onScan: (decodedText: string) => void
  onError?: (error: string) => void
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCapturing(true)

    // Simula o processamento do QR code
    setTimeout(() => {
      // Simula a leitura de um QR code
      onScan("QR-1234567890")
      setIsCapturing(false)

      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="text-center">
        <p className="mb-2 text-sm text-gray-600">Aponte a câmera para o QR Code do aluno</p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={handleCapture} className="flex items-center" disabled={isCapturing}>
            <Camera className="mr-2 h-4 w-4" />
            {isCapturing ? "Processando..." : "Capturar QR Code"}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="text-center text-xs text-gray-500">
        <p>Para melhor resultado, certifique-se que o QR Code está bem iluminado e centralizado.</p>
      </div>
    </div>
  )
}

