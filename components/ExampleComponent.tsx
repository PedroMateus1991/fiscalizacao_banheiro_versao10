'use client'

import { useState, useEffect } from 'react'
import { insertData, getData, updateData, deleteData } from '@/lib/database'

export function ExampleComponent() {
  const [items, setItems] = useState<any[]>([])
  const [newItem, setNewItem] = useState({ name: '', description: '' })

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    try {
      const data = await getData('items')
      setItems(data)
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await insertData('items', newItem)
      setNewItem({ name: '', description: '' })
      loadItems()
    } catch (error) {
      console.error('Erro ao inserir item:', error)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteData('items', id)
      loadItems()
    } catch (error) {
      console.error('Erro ao deletar item:', error)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Exemplo de CRUD com Supabase</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Nome"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Adicionar
        </button>
      </form>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded">
            <h3 className="font-bold">{item.name}</h3>
            <p>{item.description}</p>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-500 text-white px-2 py-1 rounded mt-2"
            >
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 