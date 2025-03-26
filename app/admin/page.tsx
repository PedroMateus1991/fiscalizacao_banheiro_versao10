"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { obterAlunos, cadastrarAluno, obterRegistrosAcesso } from "@/lib/admin-service"
import { AlunoCard } from "@/components/aluno-card"
import { RegistroAcessoTable } from "@/components/registro-acesso-table"
import { ExcelImport } from "@/components/excel-import"

export default function AdminPage() {
  const { toast } = useToast()
  const [nome, setNome] = useState("")
  const [turma, setTurma] = useState("")
  const [matricula, setMatricula] = useState("")
  const [alunos, setAlunos] = useState<any[]>([])
  const [registros, setRegistros] = useState<any[]>([])
  const [filtroTurma, setFiltroTurma] = useState("")
  const [filtroData, setFiltroData] = useState("")
  const [showImport, setShowImport] = useState(false)
  const [activeTab, setActiveTab] = useState("cadastro")

  useEffect(() => {
    carregarAlunos()
    carregarRegistros()
  }, [])

  const carregarAlunos = async () => {
    try {
      const dados = await obterAlunos()
      setAlunos(dados)
    } catch (error) {
      console.error("Erro ao carregar alunos:", error)
    }
  }

  const carregarRegistros = async () => {
    try {
      const dados = await obterRegistrosAcesso(filtroTurma, filtroData)
      setRegistros(dados)
    } catch (error) {
      console.error("Erro ao carregar registros:", error)
    }
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !turma || !matricula) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para cadastrar o aluno",
        variant: "destructive",
      })
      return
    }

    try {
      await cadastrarAluno({ nome, turma, matricula })
      toast({
        title: "Aluno cadastrado",
        description: "O aluno foi cadastrado com sucesso",
      })
      setNome("")
      setTurma("")
      setMatricula("")
      carregarAlunos()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cadastrar o aluno",
        variant: "destructive",
      })
    }
  }

  const handleFiltrar = () => {
    carregarRegistros()
  }

  const handleImportComplete = () => {
    setShowImport(false)
    carregarAlunos()
    toast({
      title: "Importação concluída",
      description: "Os alunos foram importados com sucesso",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-700">Administração Escolar</h1>

      <div className="w-full">
        <div className="grid w-full grid-cols-3 mb-6">
          <button
            onClick={() => setActiveTab("cadastro")}
            className={`py-2 text-center ${
              activeTab === "cadastro" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Cadastro de Alunos
          </button>
          <button
            onClick={() => setActiveTab("alunos")}
            className={`py-2 text-center ${
              activeTab === "alunos" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Alunos Cadastrados
          </button>
          <button
            onClick={() => setActiveTab("registros")}
            className={`py-2 text-center ${
              activeTab === "registros" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Registros de Acesso
          </button>
        </div>

        {activeTab === "cadastro" && (
          <div className="mt-6">
            {showImport ? (
              <ExcelImport onImportComplete={handleImportComplete} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Cadastrar Novo Aluno</CardTitle>
                  <CardDescription>Preencha os dados do aluno para gerar o QR Code e senha de acesso</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCadastro} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="nome" className="text-sm font-medium">
                        Nome Completo
                      </label>
                      <Input
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome do aluno"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="turma" className="text-sm font-medium">
                        Turma
                      </label>
                      <Input
                        id="turma"
                        value={turma}
                        onChange={(e) => setTurma(e.target.value)}
                        placeholder="Ex: 9º Ano A"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="matricula" className="text-sm font-medium">
                        Matrícula
                      </label>
                      <Input
                        id="matricula"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="Número de matrícula"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Cadastrar Aluno
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" onClick={() => setShowImport(true)} className="w-full">
                    Importar Alunos via Excel
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}

        {activeTab === "alunos" && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Alunos Cadastrados</CardTitle>
                <CardDescription>Lista de todos os alunos cadastrados no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {alunos.length > 0 ? (
                    alunos.map((aluno) => <AlunoCard key={aluno.id} aluno={aluno} />)
                  ) : (
                    <p className="col-span-full text-center text-gray-500">Nenhum aluno cadastrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "registros" && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registros de Acesso</CardTitle>
                <CardDescription>Histórico de entradas e saídas dos banheiros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label htmlFor="filtroTurma" className="mb-1 block text-sm font-medium">
                      Filtrar por Turma
                    </label>
                    <Input
                      id="filtroTurma"
                      value={filtroTurma}
                      onChange={(e) => setFiltroTurma(e.target.value)}
                      placeholder="Ex: 9º Ano A"
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="filtroData" className="mb-1 block text-sm font-medium">
                      Filtrar por Data
                    </label>
                    <Input
                      id="filtroData"
                      type="date"
                      value={filtroData}
                      onChange={(e) => setFiltroData(e.target.value)}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button onClick={handleFiltrar}>Filtrar</Button>
                  </div>
                </div>

                <RegistroAcessoTable registros={registros} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

