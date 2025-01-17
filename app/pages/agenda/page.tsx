'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/app/controler-firebase/firebasekey/firebasekey";

import { useLoginContext } from "@/app/context/loginContext/LoginContext";
import { createAgenda } from "@/app/controler-firebase/realtime-database"
import { TaskProps } from "@/app/interface/interfaces"
import { fullDate, fullHour } from "@/app/utils/create-date"

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";

const database = getDatabase(app);

export default function Home() {

  const router = useRouter()
  const [ agenda, setAgenda ] = useState<string[]>([])
  const [ failTask, setFailTask ] = useState('')
  const { employee } = useLoginContext()
  
  // Este código verifica se há algum usuario logado para ai permanecer na página.
  // Caso não aja uma entrada através do login e senha a pessoa será redirecionada a página de login 
  useEffect(() => {
    if (!employee?.employeeName) router.push('/')
  }, [])


  useEffect(() => {
    const data = ref(database, 'tasks/');
    const unsubscribe = onValue(data, (snapshot) => {
      if (snapshot.exists()) {
        const agenda:string[] = Object.values(snapshot.val());
        if (agenda) setAgenda((prev) => [...prev, ...agenda])
      } else {
        setFailTask('Não há dados!');
      }
    });

    return () => unsubscribe();
  }, []);

  function createTask() {   
    router.push('/pages/agenda/criar-agenda')
  }

  return (
    <div className="relative flex flex-col gap-3 justify-end items-center p-4 w-full h-full">    
      <div className="box-btn-add-item flex justify-end items-center w-full h-[10%] pr-2 rounded-md bg-zinc-300">
        <Button className="w-28 h-10 bg-zinc-900 hover:bg-zinc-950 text-slate-50 shadow-sm shadow-zinc-700" onClick={createTask}>Criar agenda</Button>
      </div>                
      <div className="box-detail-order flex flex-col justify-center items-center w-full h-[70%]">
        <h2 className="self-start mb-4">Agendas do dia</h2>
        <hr className="w-full"/>
        <div className="flex w-full h-[95%]">
          <ScrollArea className="w-full">
            {
              agenda.map((item, i) => {
                const order = Object.values(item)
                const [ 
                  taskAgendaDate,
                  taskAgendaState,
                  taskDescription,
                  taskEmployeeId,
                  taskEmployeeName,
                  taskId,
                  taskRegisterDate
                 ] = Object.values(item)
                  return ( 
                    <div key={i} className="flex justify-center items-center w-full h-10 rounded-sm pr-2 bg-slate-50 hover:bg-slate-100">
                      <ul className="flex justify-start items-center gap-4 w-full p-2">
                        <li>{taskId}</li>
                        <li>{taskAgendaDate}</li>
                        <li>{taskDescription}</li>
                      </ul>
                      <Button className="shadow-sm shadow-zinc-700">{taskAgendaState}</Button>
                    </div>
                  )
                })
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