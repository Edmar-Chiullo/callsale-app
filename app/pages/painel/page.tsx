'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoginContext } from "@/app/context/loginContext/LoginContext"
import { fullDate } from "@/app/utils/create-date"


import { ScrollArea } from "@/components/ui/scroll-area"

import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/app/controler-firebase/firebasekey/firebasekey";
import stractOrderList from "@/app/utils/stract-order-list"
import { useProductContext } from "@/app/context/productContext/AllProductGlrContext"
import { useClientContext } from "@/app/context/clientContext/clientContext"

export default function Home() {
  const database = getDatabase(app)

  const { employee } = useLoginContext()
  const { productList } = useProductContext()
  const { clientList } = useClientContext()

  const router = useRouter()
  const [ order, setOrder ] = useState<string[]>([])
  const [ agenda, setAgenda ] = useState<string[]>([])
  const [ vDay, setVDay ] = useState(0)
  const [ vWeek, setVWeek ] = useState(0)
  const [ vMonth, setVMonth ] = useState(0)
  const [ fullOrderDay, setFullOrderDay ] = useState<[]>([])
  const [ fullOrderWeek, setFullOrderWeek ] = useState<[]>([])
  const [ fullOrderMonth, setFullOrderMonth ] = useState<[]>([])
  const [ failTask, setFailTask ] = useState('')
  const [ calcValueDay, setCalcValueDay ] = useState<string[]>([])

  
  // Este código verifica se há algum usuario logado para ai permanecer na página.
  // Caso não aja uma entrada através do login e senha a pessoa será redirecionada a página de login 
  useEffect(() => {
    if (!employee?.employeeName) router.push('/')
  }, [])

  useEffect(() => {
    const data = ref(database, `/orders/${fullDate().slice(4,8)}/${fullDate().slice(2,8)}/`)
    const order = onValue(data, (snapshot) => {
      if (snapshot.exists()) {
        const pedidos:any = Object.values(snapshot.val())

        const orderList = stractOrderList(pedidos)
        if (pedidos) setOrder(orderList)
      } else {
        console.log('Não há dados!')
      }
    });

    return () => order()
  }, [])

  useEffect(() => {
    const dataTask = ref(database, 'tasks/' + fullDate())
    const task = onValue(dataTask, (snapshot) => {
      if (snapshot.exists()) {
        const agenda:any = Object.values(snapshot.val())
        if (agenda) setAgenda(agenda)
      } else {
        setFailTask('Não há dados!')
      }
    })
    return () => task()
  },[])

  useEffect(() => {
    calcDay()
    calcMonth()
    calWeek()
  }, [order])

  function formatarData (dataStr: string){
    const dia = dataStr.slice(0, 2);
    const mes = dataStr.slice(2, 4);
    const ano = dataStr.slice(4, 8);
    const alt = Number(dia) + 1
    return new Date(`${ano}-${mes}-${String(alt)}`); // Formato YYYY-MM-DD
  }

  function calcMonth() {
    const month:any = []
    const result:any = order.map(({orderValue, orderStatus}:any) => {
      if (!orderStatus) {
        month.push(orderValue)
        return orderValue
      } 
    
    }).reduce((sum=0, value=0) => sum + value, 0)
    
    setFullOrderMonth(month)
    const full:any = Number(result).toFixed(2)
    setVMonth(full)
  }

  function calWeek() {
    const hoje = new Date();
    const primeiroDiaSemana = new Date(hoje);
    primeiroDiaSemana.setDate(hoje.getDate() - hoje.getDay())
    const week:any = []
    const result = order.map(({orderValue, orderDate, orderStatus}:any) => {

      const dataPedido = new Date(formatarData(orderDate));
      if (dataPedido.getDate() >= primeiroDiaSemana.getDate() && dataPedido.getDate() <= hoje.getDate() && !orderStatus) { 
        week.push(orderValue)
        return orderValue 
      }

    }).reduce((sum=0, value=0) => sum + value, 0)

    setFullOrderWeek(week)
    const full:any = Number(result).toFixed(2)
    setVWeek(full)
  }

  function calcDay() {
    const date = fullDate()
    const day:any = []
    const result:any = order.map(({orderValue, orderDate, orderStatus}:any) => {
      if (orderDate.slice(0,2) === date.slice(0,2) && !orderStatus){
        day.push(orderValue)
        return orderValue
      } 
    }).reduce((sum=0, value=0) => sum + value, 0)

    setFullOrderDay(day)
    const full:any = Number(result).toFixed(2)
    setVDay(full)
  }

  return (
    <div className="relative flex flex-cols w-full h-full pt-16">
      <div className="flex flex-col justify-start gap-3 w-full h-full p-2">
        <div className="flex justify-end items-start gap-4 w-full">
          <div className="flex flex-col gap-1 justify-center items-center w-48 h-28 rounded-md shadow-md shadow-zinc-700">
            <span className="font-semibold">Soma Pedido Dia</span>
            <div>
              <span className="font-bold text-2xl">{`R$ ${vDay}`}</span>
            </div>
            <div className="text-xs">
              <span>Total pedido: </span>
              <span>{fullOrderDay.length}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-48 h-28 rounded-md shadow-md shadow-zinc-700">
            <span className="font-semibold">Soma Pedido Semana</span>
            <div>
              <span className="font-bold text-2xl">{`R$ ${vWeek}`}</span>
            </div>
            <div className="text-xs">
              <span>Total pedido: </span>
              <span>{fullOrderWeek.length}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-48 h-28 rounded-md shadow-md shadow-zinc-700">
            <span className="font-semibold">Soma Pedido Mês</span>
            <div>
              <span className="font-bold text-2xl">{`R$ ${vMonth}`}</span>
            </div>
            <div className="text-xs">
                <span>Total pedido: </span>
                <span>{fullOrderMonth.length}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-1 bg-zinc-950"></div>
          
          <div className="flex gap-6 w-full h-full">
            <div className="w-[50%] h-full">
              <h1>Agenda de hoje</h1>
              <div className="w-full rounded-sm bg-zinc-950">
                  <ul className="grid grid-cols-10 gap-1 text-slate-50 text-sm pl-2 pr-2">
                    <li className="col-start-1 col-span-2">Cod. Agenda</li>
                    <li className="col-start-3 col-span-3">Titulo</li>
                    <li className="col-start-6 col-span-3">Descrição</li>
                    <li className="col-start-10">Hora</li>
                  </ul>
                </div>
              <div className="w-full h-1 bg-zinc-100"></div>
          
              <div className="w-full">
                <ScrollArea>
                  {
                    agenda.map(({taskAgendaDate, 
                                taskAgendaHour, 
                                taskAgendaState, 
                                taskDescription, 
                                taskEmployeeId, 
                                taskEmployeeName, 
                                taskId, 
                                taskRegisterDate, 
                                taskTitle}:any, i:any) => {
                        if (taskAgendaState === 'pendente') return <div key={i} ><ul className="grid grid-cols-10 text-[16px] hover:bg-slate-100 hover:cursor-pointer pl-2 pr-2">
                                  <li className="col-start-1 col-span-2">{taskId}</li>
                                  <li className="col-start-3 col-span-3 overflow-x-hidden">{taskTitle}</li>
                                  <li className="col-start-6 col-span-3">{taskDescription}</li>
                                  <li className="col-start-10">{taskAgendaHour}</li>
                                </ul>
                                <hr  />  
                              </div>
                    })                    
                  }
                </ScrollArea>
              </div>
            </div>
            <div className="w-[50%]">
              <h1>Pedidos abertos (hoje)</h1>
              <div className="w-full">
                <div className="w-full rounded-sm bg-zinc-950">
                  <ul className="grid grid-cols-10 gap-1 text-slate-50 text-sm pl-2 pr-2">
                    <li className="col-start-1 col-span-2">Cod. Pedido</li>
                    <li className="col-start-4 col-span-4">Des. Cliente</li>
                    <li className="col-start-8 col-span-2">Valor Pedido</li>
                    <li className="col-start-10">Situação</li>
                  </ul>
                </div>
                <ScrollArea>
                  {
                    order.map(({orderCliCOD, 
                                orderDate, 
                                orderEmployeeId, 
                                orderEmployeeName, 
                                orderFantasia, 
                                orderHour, 
                                orderId, 
                                orderStatus, 
                                orderValue
                              }:any, i) => { order
                      if (orderStatus === true) return <div key={i} ><ul className="grid grid-cols-10 text-[16px] hover:bg-slate-100 hover:cursor-pointer pl-2 pr-2">
                                                                        <li className="col-start-1 col-span-2">{orderId}</li>
                                                                        <li className="col-start-4 col-span-4 overflow-x-hidden">{orderFantasia}</li>
                                                                        <li className="col-start-8 col-span-2">{`R$ ${Number(orderValue).toFixed(2)}`}</li>
                                                                        <li className="col-start-10">{String(orderStatus)}</li>
                                                                      </ul>
                                                                      <hr  />  
                                                        </div>
                                                        
                    })                    
                  }                
                </ScrollArea>                
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}