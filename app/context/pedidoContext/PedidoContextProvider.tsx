'use client'

import { useState, ReactNode } from "react";

import { PedidoContext } from "./PedidoContext";
import { ClientProps, EmployeeProps, OrderProps } from "@/app/interface/interfaces";

export const PedidoContextProvider = ({ children }: { children: ReactNode }) => {
    
    const [ client, setClient ] = useState<ClientProps | null>(null)
    const [ order, setOrder ] = useState<OrderProps | any>(null)
    const [ employee, setEmployee ] = useState<EmployeeProps | null>(null)
    const [ stateOfOrder, setStateOfOrder ] = useState<boolean | null>(null)

    return (
        <PedidoContext.Provider value={{ client, setClient, order, setOrder, employee, setEmployee, stateOfOrder, setStateOfOrder }}>
            {children}
        </PedidoContext.Provider>
    )
}