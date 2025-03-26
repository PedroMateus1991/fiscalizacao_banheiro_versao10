// Serviço para o terminal de banheiro

import { db } from "./db"

// Verifica se o aluno pode acessar o banheiro
export async function verificarAcesso(identificacao: string, genero: string) {
  // Em um ambiente real, isso consultaria o banco de dados
  // Aqui estamos simulando com dados mockados

  // Verifica se é um QR Code ou senha
  const isQrCode = identificacao.startsWith("QR-")

  // Busca o aluno pelo QR Code ou senha
  const aluno = await db.alunos.findFirst({
    where: {
      [isQrCode ? "qrCode" : "senha"]: identificacao,
    },
  })

  if (!aluno) {
    throw new Error("Aluno não encontrado")
  }

  // Verifica se o aluno já está em algum banheiro
  const acessoAtivo = await db.registrosAcesso.findFirst({
    where: {
      alunoId: aluno.id,
      dataHoraSaida: null,
    },
  })

  if (acessoAtivo && acessoAtivo.genero !== genero) {
    throw new Error("Você já está em outro banheiro")
  }

  return aluno
}

// Modificar a função registrarEntrada para sempre criar um novo registro
export async function registrarEntrada(alunoId: string, genero: string) {
  // Registra a entrada com um novo ID de visita
  return await db.registrosAcesso.create({
    data: {
      alunoId,
      genero,
      dataHoraEntrada: new Date().toISOString(),
      visitaId: `visita-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
  })
}

// Modificar a função registrarSaida para encontrar o registro correto
export async function registrarSaida(alunoId: string, genero: string) {
  // Busca o registro de acesso ativo mais recente
  const registrosAtivos = await db.registrosAcesso.findMany({
    where: {
      alunoId,
      genero,
      dataHoraSaida: null,
    },
    orderBy: {
      dataHoraEntrada: "desc",
    },
  })

  if (!registrosAtivos || registrosAtivos.length === 0) {
    throw new Error("Nenhum registro de entrada encontrado")
  }

  // Pega o registro mais recente (o primeiro da lista ordenada)
  const acessoAtivo = registrosAtivos[0]

  // Calcula a duração
  const entrada = new Date(acessoAtivo.dataHoraEntrada)
  const saida = new Date()
  const duracao = Math.floor((saida.getTime() - entrada.getTime()) / 1000) // em segundos

  // Formata a duração
  const duracaoFormatada = formatarDuracao(duracao)

  // Atualiza o registro com a saída e duração
  return await db.registrosAcesso.update({
    where: { id: acessoAtivo.id },
    data: {
      dataHoraSaida: saida.toISOString(),
      duracao: duracaoFormatada,
    },
  })
}

// Função auxiliar para formatar a duração
function formatarDuracao(segundos: number): string {
  const minutos = Math.floor(segundos / 60)
  const segundosRestantes = segundos % 60

  if (minutos === 0) {
    return `${segundosRestantes}s`
  }

  return `${minutos}m ${segundosRestantes}s`
}

