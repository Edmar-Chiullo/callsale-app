'use client'
import { createContext, useContext } from "react";
//
import { EmployeeProps } from "@/app/interface/interfaces";

interface LoginContextProps {
  employee: EmployeeProps | null
  setEmployee: (employee:EmployeeProps | null) => void;
}

export const LoginContext = createContext<LoginContextProps | null>(null);

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  
  if (!context) {
    throw new Error('useLoginContext must be used within a LoginContextProvider');
  }
  return context;
};