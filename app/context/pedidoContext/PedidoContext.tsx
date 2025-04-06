'use client'

import { createContext, useContext } from "react";
//
import { ClientProps, EmployeeProps } from "@/app/interface/interfaces";
import { Order } from "@/app/class/classes";

interface PedidoContextProps {
  client: ClientProps | null
  order: Order | null
  employee: EmployeeProps | null
  stateOfOrder: boolean | null | string
  setClient: (client:ClientProps | null) => void;
  setOrder: (order:Order | null) => void;
  setEmployee: (employee:EmployeeProps | null) => void;
  setStateOfOrder: (state:boolean | null | string) => void
}

export const PedidoContext = createContext<PedidoContextProps | null>(null);

export const usePedidoContext = () => {
  const context = useContext(PedidoContext);
  
  if (!context) {
    throw new Error('usePedidoContext must be used within a PedidoContextProvider');
  }
  return context;
};