'use client'

import React, { useState, ReactNode, useEffect } from "react";
import { LoginContext } from "./LoginContext";
import { Employee } from "@/app/class/classes";

export const LoginContextProvider = ({ children }: { children: ReactNode }) => {
    
    const [ employeeName, setEmployeeName ] = useState<Employee | null>(null)

     // Carrega os dados do Local Storage ao iniciar
     useEffect(() => {
        const storedUser = localStorage.getItem('employeeName');
        if (storedUser) {
            setEmployeeName(storedUser);
        }
    }, []);

    // Atualiza o Local Storage sempre que o estado do usuário mudar
    useEffect(() => {
        if (employeeName) {
            localStorage.setItem('user', employeeName.employeeName);
        } else {
            localStorage.removeItem('user');
        }
    }, [employeeName]);
    
    return (
        <LoginContext.Provider value={{ employeeName, setEmployeeName }}>
            {children}
        </LoginContext.Provider>
    )
}