'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoginContext } from "@/app/context/loginContext/LoginContext"

export default function Home() {

  const { employee } = useLoginContext()
  const router = useRouter()
  const [ user, setUser ] = useState()
  // Este código verifica se há algum usuario logado para ai permanecer na página.
  // Caso não aja uma entrada através do login e senha a pessoa será redirecionada a página de login 
  useEffect(() => {
    if (!employee?.employeeName) router.push('/')
  }, [])

  return (
    <div className="relative flex flex-col gap-10 justify-center items-start w-full h-full">
    </div>
  )
}