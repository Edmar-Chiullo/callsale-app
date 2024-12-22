import type { Metadata } from "next";
import { LoginContextProvider } from "./context/loginContext/LoginContextProvider";
import "./globals.css";

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
      <LoginContextProvider>
        <div className="content-app flex w-full h-svh">
          <div className="box-content flex justify-center items-center w-full rounded-lg">
              {children}
          </div>
        </div>
      </LoginContextProvider>
    </body>
    </html>
  );
}
