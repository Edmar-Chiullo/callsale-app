import { createContext, useContext } from "react";

import { ProductProps } from "@/app/interface/interfaces";

interface ProductContextProps {
  productList: ProductProps | null
  setProductList: (productList: any | null) => void
}

export const ProductContext = createContext<ProductContextProps | null>(null)

export const useProductContext = () => {
  const context = useContext(ProductContext);
  
  if (!context) {
    throw new Error('useProductContext must be used within a ProductContextProvider');
  }
  return context;
};
