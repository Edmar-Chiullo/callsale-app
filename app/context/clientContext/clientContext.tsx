import { createContext, useContext } from "react";

import { ClientProps } from "@/app/interface/interfaces";

interface ClientContextProps {
  clientList: ClientProps | null
  setClientList: (clientList: any | null) => void
}

export const ClientContext = createContext<ClientContextProps | null>(null)

export const useClientContext = () => {
  const context = useContext(ClientContext);
  
  if (!context) {
    throw new Error('useLoginContext must be used within a ProductContextProvider')
  }
  return context;
};
