'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "@/app/controler-firebase/firebasekey/firebasekey";


import { ClientProps, EmployeeProps, OrderProps } from "@/app/interface/interfaces"
import { usePedidoContext } from "@/app/context/pedidoContext/PedidoContext";
import { useLoginContext } from "@/app/context/loginContext/LoginContext";
import { Order } from "@/app/class/classes";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { boolean, z } from "zod"

import { clienteCarteira } from "@/data/tabela-cliente";
import { fullDate } from "@/app/utils/create-date";

//#########################################################################
export default function Pedido() {

  const database = getDatabase(app);
  const router = useRouter()
  const [ orders, setOrders ] = useState<OrderProps | null>(null)
  const [ itemInterface, setItemInterface ] = useState<string[]>([])

  const { setClient, setOrder, setEmployee } = usePedidoContext()
  const { employee }:any = useLoginContext()

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
  
  // Este código verifica se há algum usuario logado para ai permanecer na página.
  // Caso não aja uma entrada através do login e senha a pessoa será redirecionada a página de login 
  useEffect(() => {
    if (!employee?.employeeName) router.push('/')
  }, [])

  // A qui esta o método para listar os pedidos do dia.
  useEffect(() => {
    const key = fullDate()
    const data = ref(database, 'orders/' + key);

    const unsubscribe = onValue(data, (snapshot) => {
      if (snapshot.exists()) {
        const pedidos:any = Object.values(snapshot.val())
        
        if (pedidos) setItemInterface((prev) => [...prev, ...pedidos])

      } else {
        console.log('Não há dados!');
      }
    });

    return () => unsubscribe();
  }, []);

  function getStatusOrder(status: boolean | string) {
    switch (status) {
      case false:
        const pendingOrder = 'pendente'
        return pendingOrder

      case true:
        const finishOrder = 'finalizado'
        return finishOrder  
              
      default:
      break;
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {  

    const cliente = clienteCarteira.filter((value) => String(value.cliCOD) === values.client ? value : false)  

    if (cliente.length !== 0) {
      const objCliente:any = cliente[0]
      const order = new Order(employee, objCliente, true)

      setClient(objCliente)
      setEmployee(employee)
      setOrder(order)

      router.push('/pages/pedido/detalhe-pedido')
    } else {
      console.log('cliente não existe')
    }
  }

  return (
    <div className="relative flex flex-col gap-3 justify-end items-center w-full h-full p-4">  
      <div className="box-btn-add-item flex justify-center items-center w-full h-[10%] pr-2">
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
      <h2 className="self-start">Pedidos do dia</h2>
      <div className="box-detail-order flex justify-center items-center w-full h-[64%]">
          <div className="flex flex-col w-full h-full">
            <div className="w-full h-6 bg-zinc-950 rounded-sm pl-1 mb-1">
              <ul className="grid grid-cols-8 gap-2 w-full h-6 text-slate-50 text-sm p-1">
                <li className="col-start-1">Cod. Pedido</li>
                <li className="col-start-2">Cod. Cliente</li>
                <li className="col-start-3 col-span-3">Dec. Cliente</li>
                <li className="col-start-6">Valor pedido</li>
                <li className="col-start-8">Situação pedido</li>
              </ul>

            </div>
            <ScrollArea className="w-full">
              {
                itemInterface.map((item, i) => {
                  const order = Object.values(item)
                  return order.map((item, i) => {
                    const [
                      OrderFantasia,
                      orderCliCOD,
                      orderEmployeeId,
                      orderEmployeeName,
                      orderId,
                      orderStatus
                    ] = Object.values(item)
                    const state = getStatusOrder(orderStatus)
                    console.log(state)
                    return ( 
                      <div key={i} className="flex justify-center items-center w-full h-8 rounded-sm bg-slate-50 hover:bg-slate-100 mb-1">
                        <ul className="grid grid-cols-8 items-center w-full h-full text-sm pl-2">
                          <li className="col-start-1">{orderId}</li>
                          <li className="col-start-2">{orderCliCOD}</li>
                          <li className="col-start-3 col-span-3">{OrderFantasia}</li>
                          <li className="col-start-6">{'R$'}</li>
                          <li className="col-start-8 place-self-center"><Button variant="outline" className="h-8 bg-zinc-950 text-slate-50">{state}</Button></li>   
                        </ul>
                      </div>
                    )
                  })
                })
              }
            </ScrollArea>
          </div>                
      </div>       
    </div>
  )
}