import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatarData, formatarHora } from "@/lib/utils"

interface RegistroAcesso {
  id: string
  alunoId: string
  alunoNome: string
  alunoTurma: string
  genero: string
  dataHoraEntrada: string
  dataHoraSaida: string | null
  duracao: string | null
}

interface RegistroAcessoTableProps {
  registros: RegistroAcesso[]
}

export function RegistroAcessoTable({ registros }: RegistroAcessoTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Banheiro</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Saída</TableHead>
            <TableHead>Duração</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registros.length > 0 ? (
            registros.map((registro) => (
              <TableRow key={registro.id}>
                <TableCell>{registro.alunoNome}</TableCell>
                <TableCell>{registro.alunoTurma}</TableCell>
                <TableCell>{registro.genero === "masculino" ? "Masculino" : "Feminino"}</TableCell>
                <TableCell>{formatarData(registro.dataHoraEntrada)}</TableCell>
                <TableCell>{formatarHora(registro.dataHoraEntrada)}</TableCell>
                <TableCell>{registro.dataHoraSaida ? formatarHora(registro.dataHoraSaida) : "Em uso"}</TableCell>
                <TableCell>{registro.duracao || "-"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

