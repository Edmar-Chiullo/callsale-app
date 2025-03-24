'use client'

import { useState, ReactNode } from "react";

import { ProductProps } from "@/app/interface/interfaces"
import { ProductContext } from "./AllProductGlrContext";

export const ProductContextProvider = ({ children }: { children: ReactNode }) => {
    
    const [ productList, setProductList ] = useState<ProductProps | any>(null)

    return (      
        <ProductContext.Provider value={{ productList, setProductList }}>
            {children}
        </ProductContext.Provider>
    )
}
