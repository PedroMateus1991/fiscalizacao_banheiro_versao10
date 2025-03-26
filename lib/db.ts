// Simulação de um banco de dados para o projeto
// Em um ambiente real, isso seria substituído por um banco de dados real

interface Aluno {
  id: string
  nome: string
  turma: string
  matricula: string
  senha: string
  qrCode: string
}

// Modificar a interface RegistroAcesso para incluir um ID de visita
interface RegistroAcesso {
  id: string
  alunoId: string
  genero: "masculino" | "feminino"
  dataHoraEntrada: string
  dataHoraSaida: string | null
  duracao: string | null
  visitaId?: string // ID único para cada visita ao banheiro
  aluno?: {
    nome: string
    turma: string
  }
}

// Dados mockados para simulação
const alunos: Aluno[] = [
  {
    id: "1",
    nome: "João Silva",
    turma: "9º Ano A",
    matricula: "2023001",
    senha: "123456",
    qrCode: "QR-1234567890",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    turma: "8º Ano B",
    matricula: "2023002",
    senha: "654321",
    qrCode: "QR-0987654321",
  },
  {
    id: "3",
    nome: "Pedro Santos",
    turma: "7º Ano C",
    matricula: "2023003",
    senha: "112233",
    qrCode: "QR-1122334455",
  },
]

const registrosAcesso: RegistroAcesso[] = [
  {
    id: "1",
    alunoId: "1",
    genero: "masculino",
    dataHoraEntrada: "2023-05-10T08:30:00Z",
    dataHoraSaida: "2023-05-10T08:35:00Z",
    duracao: "5m 0s",
  },
  {
    id: "2",
    alunoId: "2",
    genero: "feminino",
    dataHoraEntrada: "2023-05-10T09:15:00Z",
    dataHoraSaida: "2023-05-10T09:20:00Z",
    duracao: "5m 0s",
  },
  {
    id: "3",
    alunoId: "3",
    genero: "masculino",
    dataHoraEntrada: "2023-05-10T10:45:00Z",
    dataHoraSaida: null,
    duracao: null,
  },
]

// Simulação de operações de banco de dados
export const db = {
  alunos: {
    findMany: async (options?: any) => {
      const resultado = [...alunos]

      if (options?.orderBy?.nome === "asc") {
        resultado.sort((a, b) => a.nome.localeCompare(b.nome))
      }

      return resultado
    },
    findFirst: async (options?: any) => {
      if (options?.where?.qrCode) {
        return alunos.find((a) => a.qrCode === options.where.qrCode) || null
      }

      if (options?.where?.senha) {
        return alunos.find((a) => a.senha === options.where.senha) || null
      }

      if (options?.where?.matricula) {
        return alunos.find((a) => a.matricula === options.where.matricula) || null
      }

      if (options?.where?.id) {
        return alunos.find((a) => a.id === options.where.id) || null
      }

      return null
    },
    create: async (options: any) => {
      const novoAluno: Aluno = {
        id: String(alunos.length + 1),
        ...options.data,
      }

      alunos.push(novoAluno)
      return novoAluno
    },
  },
  // Modificar a função findFirst do registrosAcesso para considerar o ID de visita
  registrosAcesso: {
    findMany: async (options?: any) => {
      let resultado = [...registrosAcesso]

      // Aplicar filtros
      if (options?.where) {
        if (options.where.alunoId) {
          resultado = resultado.filter((r) => r.alunoId === options.where.alunoId)
        }

        if (options.where.genero) {
          resultado = resultado.filter((r) => r.genero === options.where.genero)
        }

        if (options.where.dataHoraSaida === null) {
          resultado = resultado.filter((r) => r.dataHoraSaida === null)
        }

        if (options.where.dataHoraEntrada?.gte && options.where.dataHoraEntrada?.lte) {
          resultado = resultado.filter((r) => {
            const data = new Date(r.dataHoraEntrada)
            return (
              data >= new Date(options.where.dataHoraEntrada.gte) && data <= new Date(options.where.dataHoraEntrada.lte)
            )
          })
        }
      }

      // Incluir dados do aluno
      if (options?.include?.aluno) {
        resultado = resultado.map((r) => {
          const aluno = alunos.find((a) => a.id === r.alunoId)
          return {
            ...r,
            aluno: aluno
              ? {
                  nome: aluno.nome,
                  turma: aluno.turma,
                }
              : undefined,
          }
        })
      }

      // Ordenar
      if (options?.orderBy?.dataHoraEntrada === "desc") {
        resultado.sort((a, b) => new Date(b.dataHoraEntrada).getTime() - new Date(a.dataHoraEntrada).getTime())
      }

      return resultado
    },
    findFirst: async (options?: any) => {
      // Se estiver procurando por um registro ativo específico (entrada sem saída)
      if (options?.where?.alunoId && options?.where?.dataHoraSaida === null) {
        // Se tiver um visitaId, procura por esse ID de visita específico
        if (options?.where?.visitaId) {
          return (
            registrosAcesso.find(
              (r) =>
                r.alunoId === options.where.alunoId &&
                r.dataHoraSaida === null &&
                r.visitaId === options.where.visitaId,
            ) || null
          )
        }

        // Caso contrário, procura qualquer entrada ativa para o aluno
        return registrosAcesso.find((r) => r.alunoId === options.where.alunoId && r.dataHoraSaida === null) || null
      }

      if (options?.where?.alunoId && options?.where?.genero && options?.where?.dataHoraSaida === null) {
        return (
          registrosAcesso.find(
            (r) => r.alunoId === options.where.alunoId && r.genero === options.where.genero && r.dataHoraSaida === null,
          ) || null
        )
      }

      if (options?.where?.id) {
        return registrosAcesso.find((r) => r.id === options.where.id) || null
      }

      return null
    },
    create: async (options: any) => {
      const novoRegistro: RegistroAcesso = {
        id: String(registrosAcesso.length + 1),
        ...options.data,
        // Gera um ID único para cada visita
        visitaId: `visita-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      }

      registrosAcesso.push(novoRegistro)
      return novoRegistro
    },
    update: async (options: any) => {
      const index = registrosAcesso.findIndex((r) => r.id === options.where.id)

      if (index !== -1) {
        registrosAcesso[index] = {
          ...registrosAcesso[index],
          ...options.data,
        }

        return registrosAcesso[index]
      }

      throw new Error("Registro não encontrado")
    },
  },
}

