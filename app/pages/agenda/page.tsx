'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Image from 'next/image'

import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/app/controler-firebase/firebasekey/firebasekey";

import { useLoginContext } from "@/app/context/loginContext/LoginContext";
import { createAgenda } from "@/app/controler-firebase/realtime-database"
import { TaskProps } from "@/app/interface/interfaces"
import { fullDate, fullHour } from "@/app/utils/create-date"

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import { Task } from "@/app/class/classes";

const database = getDatabase(app);

export default function Home() {

  const router = useRouter()
  const [codAgenda, setCodAgenda] = useState<string[]>([])
  const [ coun, setCoun ] =useState(0)
  const [ agenda, setAgenda ] = useState<string[]>([])
  const [ agendaStatus, setAgendaStatus ] = useState<boolean>(false)
  const [ agendaCod, setAgendaCod ] = useState<string | null>(null)
  const [ failTask, setFailTask ] = useState('')
  const { employee } = useLoginContext()
  
  // Este código verifica se há algum usuario logado para ai permanecer na página.
  // Caso não aja uma entrada através do login e senha a pessoa será redirecionada a página de login 
  useEffect(() => {
    if (!employee?.employeeName) router.push('/')
  }, [])

  useEffect(() => {
    const data = ref(database, 'tasks/' + fullDate());
    const unsubscribe = onValue(data, (snapshot) => {
      if (snapshot.exists()) {
        const agenda:any = Object.values(snapshot.val());        
        if (agenda) setAgenda(agenda)
      } else {
        setFailTask('Não há dados!');
      }
      setCoun(coun + 1)
    });

    return () => unsubscribe();
  }, []);

  // Função responsavel por capturar o código da agenda selecionada na tela.
  function alterStatus({...values}) {  
    setAgendaStatus(true)
    const result = values.target.parentElement
    const value = result.children[0]
    const children = value.children
    
    const [agendaId] = children
    setAgendaCod(agendaId.innerText)
  }

  function createTask() {   
    router.push('/pages/agenda/criar-agenda')
  }

  function removeTasks() {   
    const tarefas = agenda.filter(({ taskId }:any) => taskId !== agendaCod)
    setAgenda(tarefas)
  }

  function alterTeskStatus({...value}) {
    const result = value.target.innerText

    const tr:any = agenda.find(({ taskId }:any) => taskId === agendaCod)
    if (tr) {
      createAgenda(tr, result)
      removeTasks()
    }
    closedCard()
  }

  function closedCard() {
    setAgendaStatus(false)
  }

  return (
    <div className="relative flex flex-col gap-3 justify-center items-center p-4 w-full h-full">    
      <div className="box-btn-add-item flex justify-end items-center w-full h-[10%] pr-2 rounded-md bg-zinc-300">
        <Button className="w-28 h-10 bg-zinc-900 hover:bg-zinc-950 text-slate-50 shadow-sm shadow-zinc-700" onClick={createTask}>Criar agenda</Button>
      </div>                
      <div className="box-detail-order flex flex-col justify-center items-center w-full h-[70%]">
        <h2 className="self-start mb-1">Agendas do dia</h2>
        <hr className="w-full"/>
        <div className="flex flex-col w-full h-[95%]">
          <div className="w-full h-6 bg-zinc-950 rounded-sm pl-1 mb-1">
            <ul className="grid grid-cols-10 gap-1 w-full h-6 text-slate-50 text-sm p-1">
              <li className="col-start-1">Cod. Agenda</li>
              <li className="col-start-2">Dada</li>
              <li className="col-start-3">Hora</li>
              <li className="col-start-4 col-span-3">Titulo</li>
              <li className="col-start-7 col-span-3">Descrição</li>
              <li className="col-start-10 text-center">Situação</li>
            </ul>
          </div>
          <ScrollArea className="flex flex-col justify-center items-center gap-[2px] w-full">
            {agendaStatus && <div className="absolute z-10 top-2 flex justify-center items-center w-96 h-[200px] p-2 rounded-lg  bg-zinc-950 shadow-zinc-400 shadow-xl">
                <Image 
                  src={'/Cancelar.png'}
                  width={20}
                  height={20}
                  alt="close" 
                  className="absolute right-0 top-0 m-2 cursor-pointer"
                  onClick={closedCard}
                />
                <div className="flex flex-col gap-6 text-slate-50">
                  <button className="w-48 h-9 text-zinc-950 bg-slate-50 rounded-sm hover:text-zinc-800 hover:cursor-pointer hover:scale-[1.01]" onClick={alterTeskStatus}>Cancelar</button>
                  <button className="w-48 h-9 text-zinc-950 bg-slate-50 rounded-sm hover:text-zinc-800 hover:cursor-pointer hover:scale-[1.01]" onClick={alterTeskStatus}>Confirmar</button>
                </div>
              </div>
            }
            {
              agenda.map((item, i) => {
                const order = Object.values(item)
                const [ 
                  taskAgendaDate,
                  taskAgendaHour,
                  taskAgendaState,
                  taskDescription,
                  taskEmployeeId,
                  taskEmployeeName,
                  taskId,
                  taskRegisterDate,
                  taskTitle
                ] = Object.values(item)
                 
                  if (taskAgendaState === 'pendente') return ( 
                    <div key={i} className="relative flex justify-center items-center w-full h-8 rounded-sm pr-2 bg-slate-50 hover:bg-slate-100">
                      <ul className="grid grid-cols-10 gap-1 w-full h-6 text-slate-950 text-md p-1">
                        <li className="col-start-1">{taskId}</li>
                        <li className="col-start-2 text-end">{taskAgendaDate}</li>
                        <li className="col-start-3 pl-6">{taskAgendaHour}</li>
                        <li className="col-start-4 col-span-3 pl-9 overflow-y-hidden">{taskTitle}</li>
                        <li className="col-start-7 col-span-4 pl-14 overflow-y-hidden">{taskDescription}</li>
                      </ul>
                      <Button className="h-7 text-center shadow-sm shadow-zinc-700" onClick={alterStatus}>{taskAgendaState}</Button>
                    </div>
                  )
              }).sort()
              /**
               * Esta área esta reservada para quanndo o os valores (pedido) estiverem vindo do banco.
               */
            }
          </ScrollArea>
        </div>             
      </div>
    </div>             
  )
}