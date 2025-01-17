'use client'

import React, { useState, ReactNode, useEffect } from "react";
import { LoginContext } from "./LoginContext";
import { EmployeeProps } from "@/app/interface/interfaces";

export const LoginContextProvider = ({ children }: { children: ReactNode }) => {
    
    const [ employee, setEmployee ] = useState<EmployeeProps | null>(null)

     // Carrega os dados do Local Storage ao iniciar
     useEffect(() => {
        const storedUser = localStorage.getItem('employee');
        if (storedUser) {
            setEmployee(JSON.parse(storedUser));
        }
    }, []);

    // Atualiza o Local Storage sempre que o estado do usuário mudar
    useEffect(() => {
        if (employee) {
            localStorage.setItem('user', JSON.stringify(employee));
        } else {
            localStorage.removeItem('user');
        }
    }, [employee]);
    
    return (
        <LoginContext.Provider value={{ employee, setEmployee }}>
            {children}
        </LoginContext.Provider>
    )
}