'use client'

import { useState, ReactNode } from "react";

import { ClientProps } from "@/app/interface/interfaces"
import { ClientContext } from "./clientContext";

export const ClientContextProvider = ({ children }: { children: ReactNode }) => {
    
    const [ clientList, setClientList ] = useState<ClientProps | any>(null)

    return (      
        <ClientContext.Provider value={{ clientList, setClientList }}>
            {children}
        </ClientContext.Provider>
    )
}
