'use client'

import Image from "next/image"

import { usePedidoContext } from "@/app/context/pedidoContext/PedidoContext"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    orderObservation: z.string().min(2, {
        message: "É nescassario observações...",
    }).max(1000),
  })

export default function FormObservation({alterState}: {alterState: (value: boolean, observaion: string) => void}) {

    const { setClient, setOrder, setEmployee, order } = usePedidoContext()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            orderObservation: '', // Código da empresa fornecedora.
        },
    })

    function onSubmit(value:z.infer<typeof formSchema>) {
        alterState(false, value.orderObservation)
    }
        
    return (
        <div className="absolute flex flex-col justify-center items-center self-center w-[900px] h-72 bg-slate-100 border shadow-lg shadow-zinc-700 rounded-md p-2">
            <Image  
                src={'/cancelarObs.png'}
                width={30}                              
                height={30}
                alt="btn-fechar"
                className="self-end hover:cursor-pointer mr-2"
                onClick={() => alterState(false, '')}
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap flex-col justify-center items-center gap-2 w-[98%] h-[95%] rounded-md">
                    <FormField
                        control={form.control}
                        name="orderObservation"
                        render={({ field }) => (
                            <FormItem className="w-full h-[%]">
                                <FormLabel>Observações</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Observações..." className="orbservation h-40 bg-slate-200" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="self-end">OK</Button>
                </form>
            </Form>
        </div>
    )
}