import type { Metadata } from "next"
import "./globals.css"

import { ProductContextProvider } from "./context/productContext/AllProductGlrProvider"
import { LoginContextProvider } from "./context/loginContext/LoginContextProvider"
import { ClientContextProvider } from "./context/clientContext/clienteContextProvider"

export const metadata: Metadata = {
  title: "DH Televendas - Painel",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="pt-br">
      <body>            
        <ClientContextProvider>
          <ProductContextProvider>
            <LoginContextProvider>
              <div className="content-app flex w-full h-svh">
                <div className="box-content flex justify-center items-center w-full rounded-lg">
                    {children}
                </div>
              </div>
            </LoginContextProvider>
          </ProductContextProvider>
        </ClientContextProvider>
      </body>
    </html>
  );
}
