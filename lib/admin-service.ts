// Serviço para a administração escolar

import { db } from "./db"
import { gerarSenhaAleatoria } from "./utils"

// Obtém todos os alunos cadastrados
export async function obterAlunos() {
  return await db.alunos.findMany({
    orderBy: { nome: "asc" },
  })
}

// Cadastra um novo aluno
export async function cadastrarAluno({ nome, turma, matricula }: { nome: string; turma: string; matricula: string }) {
  // Verifica se já existe um aluno com a mesma matrícula
  const alunoExistente = await db.alunos.findFirst({
    where: { matricula },
  })

  if (alunoExistente) {
    throw new Error("Já existe um aluno com esta matrícula")
  }

  // Gera uma senha aleatória de 4 a 6 dígitos
  const senha = gerarSenhaAleatoria(4, 6)

  // Gera um QR Code único
  const qrCode = `QR-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  // Cadastra o aluno
  return await db.alunos.create({
    data: {
      nome,
      turma,
      matricula,
      senha,
      qrCode,
    },
  })
}

// Obtém os registros de acesso com filtros opcionais
export async function obterRegistrosAcesso(turma?: string, data?: string) {
  const filtros: any = {}

  // Adiciona filtro por turma
  if (turma) {
    filtros.aluno = {
      turma: {
        contains: turma,
      },
    }
  }

  // Adiciona filtro por data
  if (data) {
    const dataInicio = new Date(data)
    dataInicio.setHours(0, 0, 0, 0)

    const dataFim = new Date(data)
    dataFim.setHours(23, 59, 59, 999)

    filtros.dataHoraEntrada = {
      gte: dataInicio.toISOString(),
      lte: dataFim.toISOString(),
    }
  }

  // Busca os registros com os filtros aplicados
  return await db.registrosAcesso.findMany({
    where: filtros,
    include: {
      aluno: {
        select: {
          nome: true,
          turma: true,
        },
      },
    },
    orderBy: {
      dataHoraEntrada: "desc",
    },
  })
}

// Adicionar função para importar alunos a partir de um arquivo Excel
export async function importarAlunosExcel(file: File) {
  // Em um ambiente real, você usaria uma biblioteca como xlsx para processar o arquivo
  // Aqui estamos apenas simulando o processamento

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simula a criação de vários alunos
  const alunosImportados = [
    { nome: "Ana Beatriz", turma: "8º Ano B", matricula: "2023010", numeroChamada: "01" },
    { nome: "Bruno Costa", turma: "8º Ano B", matricula: "2023011", numeroChamada: "02" },
    { nome: "Carla Dias", turma: "8º Ano B", matricula: "2023012", numeroChamada: "03" },
    { nome: "Daniel Esteves", turma: "8º Ano B", matricula: "2023013", numeroChamada: "04" },
    { nome: "Eduarda Freitas", turma: "8º Ano B", matricula: "2023014", numeroChamada: "05" },
  ]

  // Cadastra cada aluno
  for (const alunoData of alunosImportados) {
    await cadastrarAluno(alunoData)
  }

  return {
    importados: alunosImportados.length,
    total: alunosImportados.length,
  }
}

