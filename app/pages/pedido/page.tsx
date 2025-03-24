'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Image from "next/image";

import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/app/controler-firebase/firebasekey/firebasekey";


import { usePedidoContext } from "@/app/context/pedidoContext/PedidoContext"
import { useLoginContext } from "@/app/context/loginContext/LoginContext"
import { useClientContext } from "@/app/context/clientContext/clientContext"
import { useProductContext } from "@/app/context/productContext/AllProductGlrContext";

import { ClientProps, EmployeeProps, OrderProps } from "@/app/interface/interfaces"
import { Order } from "@/app/class/classes";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { clienteCarteira } from "@/data/tabela-cliente";
import { fullDate } from "@/app/utils/create-date";
import { AlterOrder } from "@/app/class/alter-order";
import { getOrderItens, pushAlterOrder } from "@/app/controler-firebase/realtime-database";
import { createPDF } from "@/app/utils/create-pdf";
import stractOrderList from "@/app/utils/stract-order-list";
import { ComboBoxResponsive } from "./combo-box";

//#########################################################################
export default function Pedido() {

  const database = getDatabase(app);
  const router = useRouter()
  const [ orders, setOrders ] = useState<AlterOrder | null>(null)
  const [ cardConfirm, setCardConfirm ] = useState<boolean>(false)
  const [ countItem, setCountItem ] = useState(0)
  const [ itemInterface, setItemInterface ] = useState<string[]>([])

  const { setClient, setOrder, setEmployee } = usePedidoContext()
  const { employee }:any = useLoginContext()
  const { clientList }:any = useClientContext()

  const formSchema = z.object({
    client: z.string().min(2, {
      message: "É nescassario inserir o código do cliente.",
    }),
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: '',
    },
  })
  
  useEffect(() => {
    const inputLogin:any = document.querySelector('.cod-cliente')
    inputLogin.focus()
  }, [])

  // Este código verifica se há algum usuario logado para ai permanecer na página.
  // Caso não aja uma entrada através do login e senha a pessoa será redirecionada a página de login 
  useEffect(() => {
    if (!employee?.employeeName) router.push('/')
  }, [])

  // A qui esta o método para listar os pedidos do dia.
  useEffect(() => {
    const data = ref(database, `/orders/${fullDate().slice(4,8)}/${fullDate().slice(2,8)}/`);

    setCountItem(countItem + 1)
    const unsubscribe = onValue(data, (snapshot) => {
      if (snapshot.exists()) {
        const pedidos:any = Object.values(snapshot.val())
        
        const listOrder = stractOrderList(pedidos)
        if (pedidos) setItemInterface(listOrder)
      } else {
        console.log('Não há dados!');
      }
    });


    return () => unsubscribe();
  }, []);

  function getElmentValueId(index:any) {
    const li = index.target.parentElement
    const parent = li.parentElement
    const value = parent.children[0]

    return value.innerText
  }

  function getOrder(value:string) {
    return itemInterface.map(( order :any) => order ).find(({ orderId }:any) => orderId === value)
  }
  
  function alterState(index:any) {
    setCardConfirm(true)

    const value = getElmentValueId(index)
    const el = getOrder(value)
    const val = new AlterOrder(el)
    setOrders(val)
  }

  function getStatusOrder(status: boolean | string) {
    switch (status) {
      case true:
        const pendingOrder = 'pendente'
        return pendingOrder

      case false:
        const finishOrder = 'finalizado'
        return finishOrder  
              
      default:
      break;
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {  

    const cliente = clienteCarteira.filter((value) => String(value.cliCOD) === values.client ? value : false)  
    const cli = clientList.filter((value:any) => String(value.clientCode) === values.client ? value : false)

    if (cliente.length !== 0) {
      const objCliente:any = cli[0]

      const order = new Order(employee, objCliente, true)

      setClient(objCliente)
      setEmployee(employee)
      setOrder(order)

      router.push('/pages/pedido/detalhe-pedido')
    } else {
      console.log('cliente não existe')
    }
  }

  function closedCard() {
    setCardConfirm(false)
  }

  function pushAlterStateOrder(value:any) {
    const val = value.target.innerText
    console.log(val)
    switch (val) {
      case 'Confirmar':
        orders?.setState(false)
        break;
    
      case 'Cancelar':
        orders?.setState(true)
        break;

      default:
        break;
    }
    closedCard()
    pushAlterOrder(orders)
  }

  function createPdf(index:any) {
    const value = getElmentValueId(index)
    const val = new AlterOrder(getOrder(value))

    setOrders(val)

    getOrderItens(value, val.orderDate).then((value) => {
      const val = Object.values(value)
      val.map((list:any) => {
        createPDF(orders, list)
      })
    })
  }

  return (
    <div className="relative flex flex-col gap-3 justify-end items-center w-full h-full p-4">  
      <div className="box-btn-add-item flex justify-center items-center w-full h-[10%] pr-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="rp">Representada</label>
          <ComboBoxResponsive />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-end items-center gap-4 w-full">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem className="mb-6">
                    <FormLabel>Cod. Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Código cliente" className="cod-cliente w-80 shadow-sm shadow-zinc-200" {...field} />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-10 bg-zinc-900 hover:bg-zinc-950 rounded-md shadow-sm shadow-zinc-700" >Gerar Pedido</Button>
          </form>
        </Form>
      </div>                
      <h2 className="self-start">Pedidos pendentes</h2>
      <div className="box-detail-order flex justify-center items-center w-full h-[64%]">
          <div className="flex flex-col w-full h-full">
            <div className="w-full h-6 bg-zinc-950 rounded-sm pl-1 mb-1">
              <ul className="grid grid-cols-10 gap-2 w-full h-6 text-slate-50 text-sm p-1">
                <li className="col-start-1">Cod. Pedido</li>
                <li className="col-start-2">Cod. Cliente</li>
                <li className="col-start-3 col-span-3 col-end-6">Desc. Cliente</li>
                <li className="col-start-7">Valor pedido</li>
                <li className="col-start-8 ml-2">Data</li>
                <li className="col-start-9 mr-[-40px] place-self-end">Situação pedido</li>
                <li className="col-start-10 mr-5 place-self-end">PDF</li>
              </ul>
            </div>

            <ScrollArea className="relative flex flex-col justify-center items-center w-full h-[100%]">
              {cardConfirm && <div className="absolute z-10 top-2 left-[30%] flex justify-center items-center w-96 h-[200px] p-2 rounded-lg  bg-zinc-950 shadow-zinc-400 shadow-xl">
                  <Image 
                    src={'/Cancelar.png'}
                    width={20}
                    height={20}
                    alt="close" 
                    className="absolute right-0 top-0 m-2 cursor-pointer"
                    onClick={closedCard}
                  />
                  <div className="flex flex-col gap-6 text-slate-50">
                    <button className="w-48 h-9 text-zinc-950 bg-slate-50 rounded-sm hover:text-zinc-800 hover:cursor-pointer hover:scale-[1.01]" onClick={(value) => pushAlterStateOrder(value)}>Cancelar</button>
                    <button className="w-48 h-9 text-zinc-950 bg-slate-50 rounded-sm hover:text-zinc-800 hover:cursor-pointer hover:scale-[1.01]" onClick={(value) => pushAlterStateOrder(value)}>Confirmar</button>
                  </div>
                </div>
              }
              {
                itemInterface.map((order, i) => {
                    const { orderCliCOD, orderDate, orderFantasia, orderHour, orderId, orderStatus, orderValue}:any = order          
                    const state = getStatusOrder(orderStatus)
                    const formattedDate = orderDate.slice(0, 2) + "/" + orderDate.slice(2, 4);

                   if (orderStatus) return ( 
                      <div key={i} className="flex justify-center items-center mb-1 w-full h-8 rounded-sm bg-slate-50 hover:bg-slate-100">
                        <ul className="grid grid-cols-10 items-center w-full h-full text-sm pl-2 pr-1">
                          <li className="col-start-1">{orderId}</li>
                          <li className="col-start-2">{orderCliCOD}</li>
                          <li className="col-start-3 col-span-3 col-end-6">{orderFantasia}</li>
                          <li className="col-start-7 pl-3">{`R$ ${Number(orderValue).toFixed(2)}`}</li>
                          <li className="col-start-8 pl-3">{`${formattedDate}`}</li>
                          <li className="col-start-9 mr-[-40px] place-self-end"><Button onClick={(value) => alterState(value)} className="h-8 bg-zinc-900 hover:bg-zinc-950 text-slate-50">{state}</Button></li>   
                          <li className="col-start-10 place-self-end"><Button onClick={(value) => createPdf(value)} className="h-8 bg-zinc-900 hover:bg-zinc-950 text-slate-50">PDF</Button></li>   
                        </ul>
                      </div>
                    )
                })
              }
            </ScrollArea>
          </div>                
      </div>       
    </div>
  )
}