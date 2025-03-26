import { supabase } from './supabase'

// Exemplo de função para inserir dados
export async function insertData(table: string, data: any) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
  
  if (error) throw error
  return result
}

// Exemplo de função para buscar dados
export async function getData(table: string, query?: any) {
  let supabaseQuery = supabase.from(table).select()
  
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      supabaseQuery = supabaseQuery.eq(key, value)
    })
  }
  
  const { data, error } = await supabaseQuery
  
  if (error) throw error
  return data
}

// Exemplo de função para atualizar dados
export async function updateData(table: string, id: string, data: any) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return result
}

// Exemplo de função para deletar dados
export async function deleteData(table: string, id: string) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 