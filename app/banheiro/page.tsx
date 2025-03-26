"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { verificarAcesso, registrarEntrada, registrarSaida } from "@/lib/bathroom-service"
import { Clock } from "@/components/clock"
import { QrScanner } from "@/components/qr-scanner"

export default function BathroomTerminal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [senha, setSenha] = useState("")
  const [genero, setGenero] = useState(searchParams.get("genero") || "masculino")
  const [scannerAtivo, setScannerAtivo] = useState(true)
  const [alunoAtual, setAlunoAtual] = useState<any>(null)
  const [modo, setModo] = useState<"entrada" | "saida">("entrada")
  const [activeTab, setActiveTab] = useState("qrcode")

  useEffect(() => {
    // Atualiza a URL quando o gênero muda
    router.push(`/banheiro?genero=${genero}`)
  }, [genero, router])

  const handleQrCodeScan = async (result: string) => {
    if (!result) return

    try {
      setScannerAtivo(false)
      const aluno = await verificarAcesso(result, genero)

      if (aluno) {
        setAlunoAtual(aluno)
        if (modo === "entrada") {
          await registrarEntrada(aluno.id, genero)
          toast({
            title: "Entrada registrada",
            description: `Bem-vindo(a), ${aluno.nome}!`,
          })
          // Aguarda 3 segundo e reseta para o próximo aluno
          setTimeout(() => {
            setAlunoAtual(null)
            setScannerAtivo(true)
          }, 3000)
        } else {
          await registrarSaida(aluno.id, genero)
          toast({
            title: "Saída registrada",
            description: `Até mais, ${aluno.nome}!`,
          })
          // Aguarda 1 segundo e reseta para o próximo aluno
          setTimeout(() => {
            setAlunoAtual(null)
            setModo("entrada")
            setScannerAtivo(true)
          }, 1000)
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível verificar o acesso",
        variant: "destructive",
      })
      setTimeout(() => {
        setScannerAtivo(true)
      }, 1000)
    }
  }

  const handleSenhaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (senha.length < 4 || senha.length > 6) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter entre 4 e 6 dígitos",
        variant: "destructive",
      })
      return
    }

    try {
      const aluno = await verificarAcesso(senha, genero)

      if (aluno) {
        setAlunoAtual(aluno)
        if (modo === "entrada") {
          await registrarEntrada(aluno.id, genero)
          toast({
            title: "Entrada registrada",
            description: `Bem-vindo(a), ${aluno.nome}!`,
          })
          // Aguarda 1 segundo e reseta para o próximo aluno
          setTimeout(() => {
            setAlunoAtual(null)
            setSenha("")
          }, 1000)
        } else {
          await registrarSaida(aluno.id, genero)
          toast({
            title: "Saída registrada",
            description: `Até mais, ${aluno.nome}!`,
          })
          // Aguarda 1 segundo e reseta para o próximo aluno
          setTimeout(() => {
            setAlunoAtual(null)
            setModo("entrada")
            setSenha("")
          }, 1000)
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Senha inválida",
        variant: "destructive",
      })
    }
  }

  const handleSaida = async () => {
    setModo("saida")
    setScannerAtivo(true)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className={`${genero === "masculino" ? "bg-blue-600" : "bg-pink-600"} text-white rounded-t-lg`}>
          <CardTitle className="text-center text-2xl">
            Banheiro {genero === "masculino" ? "Masculino" : "Feminino"}
          </CardTitle>
          <CardDescription className="text-center text-white">
            <Clock />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full">
            <div className="grid w-full grid-cols-2 mb-4">
              <button
                onClick={() => setActiveTab("qrcode")}
                className={`py-2 text-center ${
                  activeTab === "qrcode" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                QR Code
              </button>
              <button
                onClick={() => setActiveTab("senha")}
                className={`py-2 text-center ${
                  activeTab === "senha" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Senha
              </button>
            </div>

            {activeTab === "qrcode" && (
              <div className="mt-4">
                <div className="flex h-[250px] items-center justify-center rounded-lg border bg-gray-50">
                  {scannerAtivo ? (
                    <QrScanner onScan={handleQrCodeScan} onError={(error) => console.error(error)} />
                  ) : (
                    <p className="text-center text-gray-500">Processando...</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "senha" && (
              <div className="mt-4">
                <form onSubmit={handleSenhaSubmit}>
                  <div className="space-y-4">
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="text-center text-xl"
                      maxLength={6}
                    />
                    <Button type="submit" className="w-full">
                      Verificar
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {alunoAtual && (
            <div className="mt-6 space-y-4 rounded-lg bg-gray-50 p-4">
              <div className="text-center">
                <h3 className="text-xl font-bold">{alunoAtual.nome}</h3>
                <p className="text-gray-600">Turma: {alunoAtual.turma}</p>
                <p className="text-gray-600">Matrícula: {alunoAtual.matricula}</p>
              </div>

              {modo === "entrada" && (
                <Button onClick={handleSaida} className="w-full bg-red-500 hover:bg-red-600">
                  Registrar Saída
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button
            variant="outline"
            onClick={() => setGenero("masculino")}
            className={genero === "masculino" ? "border-blue-600 text-blue-600" : ""}
          >
            Masculino
          </Button>
          <Button
            variant="outline"
            onClick={() => setGenero("feminino")}
            className={genero === "feminino" ? "border-pink-600 text-pink-600" : ""}
          >
            Feminino
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

