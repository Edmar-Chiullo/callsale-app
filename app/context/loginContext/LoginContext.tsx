'use client'
import { Employee } from "@/app/class/classes";
import { createContext, useContext } from "react";
//
interface LoginContextProps {
  employeeId: number
  employeeName: string | null
  employeePermissionType: string
  setEmployeeName: (employee: Employee | null) => void;
}

export const LoginContext = createContext<LoginContextProps | null>(null);

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  
  if (!context) {
    throw new Error('useLoginContext must be used within a LoginContextProvider');
  }
  return context;
};