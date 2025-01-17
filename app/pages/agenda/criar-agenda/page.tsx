'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useLoginContext } from "@/app/context/loginContext/LoginContext"
import { TaskProps } from "@/app/interface/interfaces";
import { fullFormatedDate, fullHour } from "@/app/utils/create-date";
import { Textarea } from "@/components/ui/textarea";
import { createAgenda } from "@/app/controler-firebase/realtime-database";

const formSchema = z.object({
    taskId: z.string().min(2, {
        message: "É nescassario inserir o código do produto.",
    }).max(30),
    taskEmployeeId: z.string().min(1, {
        message: "É nescassario inserir adescrição do produto.",
    }).max(100),
    taskEmployeeName: z.string().min(2, {
        message: "É nescassario inserir o valor do produto.",
    }).max(30),
    taskAgendaDate: z.string().min(1, {
        message: "É nescassario inserir o valor do produto.",
    }).max(30),
    taskRegisterDate: z.string().min(1, { /// Esta se refere a data em que o agendamento foi cadastrado.
        message: "É nescassario inserir o valor do produto.",
    }).max(30),
    // taskAgendaStatus: z.string().min(1, {
    //     message: "É nescassario inserir o valor do produto.",
    // }).max(30),
    taskTitle: z.string().min(1, {
        message: "É nescassario inserir a quantidade.",
    }).max(500), 
    taskDescription: z.string().min(1, {
        message: "É nescassario inserir a quantidade.",
    }).max(1000),
  })

export default function CreateAgenda() {
    const [ agendaId, setAgendaId ] = useState('')
    const { employee } = useLoginContext()
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            taskId: '', // Código da empresa fornecedora.
            taskEmployeeId: '',
            taskEmployeeName: '',
            taskTitle: '',
            taskDescription: '',
            taskAgendaDate: '',
            taskRegisterDate: '',
        },
    })

    useEffect(() => {
        if (!employee?.employeeName) router.push('/')
        
        const id = `AG-${fullHour()}`
        const date = fullFormatedDate()
        setAgendaId(id)

        form.setValue('taskId', id || '')
        form.setValue('taskEmployeeId', String(employee?.employeeId) || '')    
        form.setValue('taskEmployeeName', employee?.employeeName || '')    
        form.setValue('taskRegisterDate', date || '')    

    }, [])

    function onSubmit(values: z.infer<typeof formSchema>) { 
        createAgenda(values, 'pendente')
        console.log(values)
    }

    return(
        <div className="flex justify-center items-end w-full h-full pb-15">
           <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap w-[98%] h-[85%]">
                    <div className="flex justify-between items-center w-full h-[5%] p-2 mb-2">
                        <FormField
                            control={form.control}
                            name="taskId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cod. Agenda</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Código da agenda" className="cod-cliente w-80 shadow-sm shadow-zinc-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taskEmployeeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cod. Usuário</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Código do usuário" className="cod-cliente w-80 shadow-sm shadow-zinc-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taskEmployeeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome usuário</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do usuário" className="cod-cliente w-80 shadow-sm shadow-zinc-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <hr />            
                    <div className="flex justify-between items-center w-full h-[10%] p-2 mb-4">
                        <FormField
                            control={form.control}
                            name="taskRegisterDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data do cadastro</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Data do cadastro" className="cod-cliente w-80 shadow-sm shadow-zinc-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taskAgendaDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data da agenda</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Data agenda" className="cod-cliente w-80 shadow-sm shadow-zinc-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taskTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assunto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Assunto" className="cod-cliente w-80" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>        
                    <div className="flex justify-center items-center w-full h-[20%] p-2">
                        <FormField
                            control={form.control}
                            name="taskDescription"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea  placeholder="Digite seu texto..." className="description w-full h-32 shadow-sm shadow-zinc-300" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="box-buttom flex flex-col gap-3 w-full p-2" >
                        <Button className="w-full h-10 bg-zinc-900 hover:bg-zinc-950 text-slate-200 text-lg shadow-sm shadow-zinc-500">Criar agenda</Button>
                        <Button type="button" className="w-full h-10 bg-zinc-900 hover:bg-zinc-950 text-slate-200 text-lg shadow-sm shadow-zinc-500" onClick={() => router.push('/pages/agenda')}>Cancelar</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}