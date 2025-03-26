"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { importarAlunosExcel } from "@/lib/admin-service"
import { useToast } from "@/hooks/use-toast"

export function ExcelImport({ onImportComplete }: { onImportComplete: () => void }) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Verifica se é um arquivo Excel
    if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
      setError("Por favor, selecione um arquivo Excel válido (.xlsx ou .xls)")
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError(null)

    // Simula uma prévia dos dados (em um ambiente real, você processaria o arquivo)
    simulatePreview(selectedFile)
  }

  const simulatePreview = (file: File) => {
    // Em um ambiente real, você usaria uma biblioteca como xlsx para ler o arquivo
    // Aqui estamos apenas simulando uma prévia
    setTimeout(() => {
      setPreviewData([
        { numeroChamada: "01", nome: "João Silva", turma: "9º Ano A", matricula: "2023001" },
        { numeroChamada: "02", nome: "Maria Oliveira", turma: "9º Ano A", matricula: "2023002" },
        { numeroChamada: "03", nome: "Pedro Santos", turma: "9º Ano A", matricula: "2023003" },
        // Mais dados seriam mostrados aqui...
      ])
    }, 500)
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      setProgress(0)

      // Simula o progresso do upload
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 300)

      // Simula o processamento do arquivo
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Chama a função de importação
      const resultado = await importarAlunosExcel(file)

      clearInterval(interval)
      setProgress(100)

      toast({
        title: "Importação concluída",
        description: `${resultado.importados} alunos importados com sucesso.`,
      })

      // Limpa o estado e notifica o componente pai
      setTimeout(() => {
        setFile(null)
        setPreviewData(null)
        setIsUploading(false)
        onImportComplete()
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Erro ao importar o arquivo")
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setFile(null)
    setPreviewData(null)
    setError(null)
    // Limpa o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Alunos via Excel</CardTitle>
        <CardDescription>
          Faça upload de um arquivo Excel com os dados dos alunos para cadastro em massa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6">
          <div className="mb-4 text-center">
            <FileText className="mx-auto mb-2 h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-500">{file ? file.name : "Selecione um arquivo Excel (.xlsx ou .xls)"}</p>
            {file && <p className="mt-1 text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
          </div>

          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            Selecionar Arquivo
          </Button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-center text-sm text-gray-500">Processando arquivo... {progress}%</p>
          </div>
        )}

        {previewData && !isUploading && (
          <div className="mt-4">
            <h3 className="mb-2 font-medium">Prévia dos dados:</h3>
            <div className="max-h-60 overflow-auto rounded border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nº</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nome</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Turma</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Matrícula</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {previewData.map((aluno, index) => (
                    <tr key={index} className="bg-white">
                      <td className="whitespace-nowrap px-4 py-2 text-sm">{aluno.numeroChamada}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm">{aluno.nome}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm">{aluno.turma}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm">{aluno.matricula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Mostrando {previewData.length} de {previewData.length} registros
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
          Cancelar
        </Button>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? (
            <>Processando...</>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Importar Alunos
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

