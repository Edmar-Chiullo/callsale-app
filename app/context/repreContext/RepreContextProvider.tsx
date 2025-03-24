'use client'

import { useState, ReactNode } from "react";
import { RepreContext } from "./RepreContext";

export const RepreContextProvider = ({ children }: { children: ReactNode }) => {
    
    const [ represented, setRepresentad ] = useState<string | null>(null)

    return (      
        <RepreContext.Provider value={{ represented, setRepresentad }}>
            {children}
        </RepreContext.Provider>
    )
}
