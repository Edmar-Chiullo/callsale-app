'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useLoginContext } from "@/app/context/loginContext/LoginContext"
import { usePedidoContext } from "@/app/context/pedidoContext/PedidoContext"
import { useProductContext } from "@/app/context/productContext/AllProductGlrContext"

import ItemList from "@/app/utils/item-list"

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ItemOrder } from "@/app/class/classes"
import { pushOrder, pushOrderItens } from "@/app/controler-firebase/realtime-database"
import { convertListToArray } from "@/app/utils/convert-list-to-arrar"
import { useRepresentedContext } from "@/app/context/repreContext/RepreContext"


const formSchema = z.object({
    productCod: z.string().min(2, {
        message: "É nescassario inserir o código do produto.",
    }).max(30),
    productDescription: z.string().min(2, {
        message: "É nescassario inserir adescrição do produto.",
    }).max(100),
    productUnitaryValue: z.string().min(2, {
        message: "É nescassario inserir o valor do produto.",
    }).max(30),
    productQuantity: z.string().min(1, {
        message: "É nescassario inserir a quantidade.",
    }).max(10),
    productIPI: z.string().min(1, {
        message: "É nescassario inserir o IPI.",
    }).max(30),
    productST: z.string().min(1, {
        message: "É nescassario inserir o ST.",
    }).max(30),
  })

export default function OrderDetail() {
    const [ itemInterface, setItemInterface ] = useState<string[]>([])
    const [ orderList, setOrderList ] = useState<ItemList | null>(null)
    const [ count, setCount ] = useState(0) // Adiciona o id do produto.
    const [ countInterface, setCountInterface ] = useState(0)
    const [ itemFullValue, setItemFullValue ] = useState<number | null>(0)
    const [ alertConfirme, setAlertConfirme ] = useState(false)
    const [ numOrder, setNumOrder ] = useState<number[]>([])
    const [ orderValue, setOrderValue ] = useState<number[]>([])
    const [ resultOrderValue, setResultOrderValue ] = useState(0) 

    const router = useRouter()

    const { client, order, setStateOfOrder } = usePedidoContext()
    const { employee } = useLoginContext()
    const { productList }:any = useProductContext()
    const { represented } = useRepresentedContext()
      
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productCod: '', // Código da empresa fornecedora.
            productDescription: '',
            productUnitaryValue: '',
            productQuantity: '',
            productIPI: '',
            productST: '',
        },
    })
    
    // Este código verifica se há algum usuario logado para ai permanecer na página.
    // Caso não aja uma entrada através do login e senha a pessoa será redirecionada a página de login 
    useEffect(() => {
        if (!employee?.employeeName) {
            router.push('/')
        } else {
            const list = new ItemList() 
            setOrderList(list)      
        }
    }, [])

    useEffect(() => {
        if (orderValue[0] == null) return 

        const result = orderValue.reduce((anterior, atual):any => anterior + atual) // Calculando o valor do pedido.
        setResultOrderValue(result) // Valor a ser impresso na interface mostrando o valor total do pedido.

    }, [orderValue])

    useEffect(() => {
    const inputLogin:any = document.querySelector('.cod-produto')
    inputLogin.focus()
    }, [])


    function removeElement(productId:any, fullValue:any) {
        const itemRemoved = orderList?.removeItem(productId)

        const indexOrderValue = productId
       
        setItemInterface((prev) => prev.filter((ped, ind) => ind !== productId)); // Esta função esta rrmovendo com base no indice
        setNumOrder((prev) => prev.filter((ped, ind) => ped !== fullValue)); // Esta função esta rrmovendo com base no valor
       
        setOrderValue((prev) => prev.filter((ped, ind) => ind !== indexOrderValue));
        
        if (orderValue.length === 1) setResultOrderValue(0)
        
        setCount(count - 1)
    }

    function changeInputs({productDescription, productUnitValord, productRepresented}:any) {
        if (productRepresented !== represented) return console.log('Produto não pertence a represantada.')
        form.setValue('productDescription', productDescription || '')
        form.setValue('productUnitaryValue', String(productUnitValord) || '')    
    }

    function getProduct(value: string) {
        if (value) {
            const { GLR, SONGLE }:any = productList

            switch (represented) {
                case 'GLR':
                    const repGLR = Object.values(GLR)
                    const glr = repGLR.filter((ped:any) => ped.productCod === value)    
                    console.log(glr)
                    if (!glr[0]) return console.log('Código não pertence a representada!') 
                    changeInputs(glr[0])       
                    break;
            
                case 'SONGLE':
                    const repSONGLE = Object.values(SONGLE)
                    const songle = repSONGLE.filter((ped:any) => ped.productType === value)
                    console.log(songle)
                    if (!songle[0]) return console.log('Código não pertence a representada!') 
                    changeInputs(songle[0])       
                    break;

                default:
                break;
            }
        }
    }

    function clearInputs() {
        form.reset({
            productCod: '', // Código da empresa fornecedora.
            productDescription: '',
            productUnitaryValue: '',
            productQuantity: '',
            productIPI: '',
            productST: '',
        })
    }

    function calcOrderValue(value: any) {
        setOrderValue((lastValue) => [...lastValue, value])
    }

    function onSubmit(values: z.infer<typeof formSchema>) {  
        const itemOrder = new ItemOrder(values)
        const fullValue = itemOrder.productFullValue

        calcOrderValue(fullValue)

        setItemFullValue(fullValue)

        orderList?.pushItem(itemOrder)

        const element = orderList?.getLastItem()
        
        if (element) {
            const { item } = element
            setItemInterface((prev) => [...prev, item])
        }
        
        setCount(count+1)
        setCountInterface(countInterface+1)

        clearInputs()

        const inputLogin:any = document.querySelector('.cod-produto')
        inputLogin.focus()
    
    }

    function finishOrder() {
        setAlertConfirme(true)        
    }

    function finishedOrder(value:any) { 
        if (value.target.innerHTML === 'Aberto') {
            order?.setValue(resultOrderValue)
            order?.updateStatus(true)
            const lista = convertListToArray(itemInterface)

            pushOrder(order)
            
            const id:any = order?.orderId
            pushOrderItens(lista, id)
            
            setCount(0)

            setStateOfOrder(true)
            
            clearInputs()

            router.push('/pages/pedido')

        } else {
            setStateOfOrder(false)
        }
        setAlertConfirme(false)
    }

    return (
        <div className="relative flex flex-col justify-end w-full h-[95%]">
            <div className="box-info-client flex justify-center items-center w-full h-[10%]">
                <div className="flex justify-between items-end w-full h-[85%] p-2">
                    <div className="flex gap-5 w-full">
                        <div className="flex flex-col gap-1 w-[12%] h-10">
                            <span className="text-xs">Cod. Pedido</span>
                            <ul className="flex justify-start items-end border rounded-sm h-7 pl-1 w-full">
                                <li>{order?.orderId}</li>
                            </ul>

                        </div>
                        <div className="flex flex-col gap-1 w-[40%] h-10">
                            <span className="text-xs">Desc. Cliente</span>
                            <ul className="flex justify-start items-end border rounded-sm h-7 pl-1 w-full">
                                    <li>{`${client?.clientAlias} - ${client?.clientCity}`}</li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-1 w-[40%] h-10">
                            <span className="text-xs">Representada</span>
                            <ul className="flex justify-start items-end border rounded-sm h-7 pl-1 w-full">
                                    <li>{`${represented}`}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-[10%] h-10">
                        <span className="text-xs">Valor Total</span>
                        <ul className="flex justify-between items-end border rounded-sm h-7 pl-1 pr-1 w-full">
                                <li>R$</li>
                                <li>{resultOrderValue.toFixed(2)}</li>
                        </ul>
                    </div>
                </div>                        
            </div>
            <hr/>             
            <div className="box-btn-add-item flex justify-center items-center w-full h-[40%] max-h-[38%] bg-gray-50 rounded-lg">
                <div className="flex flex-wrap justify-center w-[98%] h-[85%]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap gap-x-10 w-[98%] h-[95%]">
                            <FormField
                                control={form.control}
                                name="productCod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cod. Produto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Código do produto" className="cod-produto w-80" {...field} onBlur={(value) => getProduct(value.target.value)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="productDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição Produto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Descrição produto" className="cod-cliente w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="productUnitaryValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor Un.</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Valor unitário" className="cod-cliente w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="productQuantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantidade</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Quantidade" className="cod-cliente w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="productIPI"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>IPI</FormLabel>
                                        <FormControl>
                                        <Input placeholder="IPI" className="cod-cliente w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="productST"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ST</FormLabel>
                                        <FormControl>
                                        <Input placeholder="ST" className="cod-cliente w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between gap-2 w-full h-14 pr-8">
                                <Button type="submit" className="bg-zinc-900 hover:bg-zinc-950 mt-3 rounded-lg">Adicionar Item</Button>
                                <div className="flex gap-2">
                                    <Button type="button" onClick={finishOrder} className="bg-zinc-900 hover:bg-zinc-950 mt-3 rounded-lg">Finalizar Pedido</Button>
                                    <Button type="button" className="bg-zinc-900 hover:bg-zinc-950 mt-3 rounded-lg" onClick={() => router.push('/pages/pedido')}>Cancelar Pedido</Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>                        
            </div>   
            <hr/>             
            <div className="box-detail-order flex justify-center items-center w-full h-[56%] p-1 bg-gray-50">
                <div className="flex flex-col justify-center items-center w-[99%] h-[100%] rounded-lg bg-slate-100">
                    <div className="flex flex-col justify-between w-full h-[9%] rounded-sm bg-slate-950">
                        <ul className="flex justify-between w-full h-[100%] pl-2 pr-2 text-white">
                            <div className="grid grid-cols-[50px_150px_430px] w-full">
                                <li className="col-start-1 col-span-1">Item</li>
                                <li className="col-start-2 col-span-1">Cod. Item</li>
                                <li className="col-start-3 col-span-1">Descrição</li>
                            </div>
                            <div className="grid grid-cols-[100px_50px_70px_70px_80px] w-full">
                                <li className="col-start-1 col-span-1">Valor Uni.</li>
                                <li className="col-start-2 col-span-1">Qt.</li>
                                <li className="col-start-3 col-span-1">IPI</li>
                                <li className="col-start-4 col-span-1">ST</li>
                                <li className="col-start-5 col-span-1">Valor Total</li>
                            </div>
                        </ul>
                    </div>
                    <ScrollArea className="flex flex-col pt-1 w-full h-[92%]">
                        {
                            itemInterface.map((item:any, key:any) => {
                                if (item) {
                                    const { productId, productCod, productDescription, productUnitaryValue, productQuantity,
                                        productST, productIPI, productFullValue
                                     } = item
                                     const  fullValueUnity = productFullValue.toFixed(2)
                                    return (
                                        <div key={key} className="relative flex flex-col justify-between items-center mb-[2px] w-full h-7 rounded-sm hover:bg-slate-300 bg-slate-200">
                                            <ul className="grid grid-cols-[50px_150px_430px_100px_45px_70px_70px_80px] place-content-start w-full pl-3">
                                                <li >{key + 1}</li>
                                                <li>{productCod}</li>
                                                <li>{productDescription}</li>
                                                <li>{'R$' + ' ' + productUnitaryValue}</li>
                                                <li>{productQuantity}</li>
                                                <li>{productIPI + '%'}</li>
                                                <li>{productST + '%'}</li>
                                                <li>{'R$' + ' ' + fullValueUnity}</li>
                                            </ul>
                                            <Button className="absolute right-0 top-0 h-[94%] rounded-sm shadow-sm shadow-black" onClick={() => removeElement(key, fullValueUnity)}>Exluir</Button>
                                        </div>
                                    )    
                                } else {
                                    return <h1 key={key} className="text-black">Não há dados</h1>
                                }
                            })
                        }
                    </ScrollArea>
                </div>                
            </div>        
            { alertConfirme &&
              <div className='absolute z-10 flex justify-center items-center w-full h-full bg-gradient-to-tr from-gray-400'>
                <div className="flex flex-col justify-around items-center w-96 h-48 rounded-xl shadow-sm shadow-zinc-950 bg-zinc-800" >
                    <h1 className="text-fuchsia-50 text-xl">Escolha como finalizar seu pedido</h1>
                    <div className="flex justify-center gap-5 w-full h-[30%]">
                        <Button onClick={(valor) => finishedOrder(valor)} className="w-28 h-10 bg-slate-50 hover:bg-slate-200 text-zinc-950 text-lg">Aberto</Button>
                        <Button onClick={(valor) => finishedOrder(valor)} className="w-28 h-10 bg-slate-50 hover:bg-slate-200 text-zinc-950 text-lg">Fechado</Button>
                    </div>
                </div>
              </div>
              }        b
        </div>
    )
}