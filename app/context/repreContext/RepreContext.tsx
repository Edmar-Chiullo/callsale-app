import { createContext, useContext } from "react";

interface RepreContextProps {
  represented: string | null
  setRepresentad: (represented:string | null) => void
}

export const RepreContext = createContext<RepreContextProps | null>(null)

export const useRepresentedContext = () => {
  const context = useContext(RepreContext);
  
  if (!context) {
    throw new Error('useRepreContext must be used within a RepreContextProvider');
  }
  return context;
};
