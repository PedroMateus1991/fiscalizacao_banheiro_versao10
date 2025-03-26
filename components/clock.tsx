"use client"

import { useState, useEffect, memo } from "react"

function ClockComponent() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="text-center">
      <div className="text-xl font-bold">{formatTime(time)}</div>
      <div className="text-sm">{formatDate(time)}</div>
    </div>
  )
}

// Usar memo para evitar re-renderizações desnecessárias
export const Clock = memo(ClockComponent)

