"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Eye, EyeOff, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AlunoCardProps {
  aluno: {
    id: string
    nome: string
    turma: string
    matricula: string
    senha: string
    qrCode: string
  }
}

export function AlunoCard({ aluno }: AlunoCardProps) {
  const { toast } = useToast()
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const copiarQRCode = () => {
    navigator.clipboard.writeText(aluno.qrCode)
    toast({
      title: "QR Code copiado",
      description: "O código QR foi copiado para a área de transferência",
    })
  }

  const copiarSenha = () => {
    navigator.clipboard.writeText(aluno.senha)
    toast({
      title: "Senha copiada",
      description: "A senha foi copiada para a área de transferência",
    })
  }

  const imprimirQRCode = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${aluno.nome}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            .container { margin: 20px; }
            h2 { margin-bottom: 5px; }
            p { margin: 5px 0; }
            .qrcode { margin: 20px 0; }
            .senha { font-size: 18px; font-weight: bold; margin: 15px 0; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>${aluno.nome}</h2>
            <p>Turma: ${aluno.turma}</p>
            <p>Matrícula: ${aluno.matricula}</p>
            <div class="qrcode" id="qrcode"></div>
            <p class="senha">Senha: ${aluno.senha}</p>
            <button onclick="window.print()">Imprimir</button>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
          <script>
            var typeNumber = 4;
            var errorCorrectionLevel = 'L';
            var qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData('${aluno.qrCode}');
            qr.make();
            document.getElementById('qrcode').innerHTML = qr.createImgTag(5);
          </script>
        </body>
      </html>
    `)
      printWindow.document.close()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{aluno.nome}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Turma:</strong> {aluno.turma}
          </p>
          <p>
            <strong>Matrícula:</strong> {aluno.matricula}
          </p>
          <div className="flex items-center gap-2">
            <strong>Senha:</strong>
            <span>{mostrarSenha ? aluno.senha : "••••••"}</span>
            <Button variant="ghost" size="icon" onClick={() => setMostrarSenha(!mostrarSenha)} className="h-6 w-6">
              {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={copiarSenha} className="h-6 w-6">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Ver QR Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code de {aluno.nome}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4">
              <QRCodeSVG value={aluno.qrCode} size={200} />
              <div className="flex gap-2">
                <Button onClick={copiarQRCode} size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
                <Button onClick={imprimirQRCode} size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="default" size="sm" onClick={imprimirQRCode}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </CardFooter>
    </Card>
  )
}

