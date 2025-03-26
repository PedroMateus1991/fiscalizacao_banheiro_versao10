import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">Cuidando do Futuro</h1>
          <p className="mt-2 text-gray-600">Sistema de Fiscalização de Banheiro</p>
        </div>

        <div className="space-y-4">
          <Link href="/banheiro" className="block w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Terminal de Banheiro</Button>
          </Link>

          <Link href="/admin" className="block w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700">Administração Escolar</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

