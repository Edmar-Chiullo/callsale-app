'use client'

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { checkPath } from "../utils/check-path";
import { PedidoContextProvider } from "@/app/context/pedidoContext/PedidoContextProvider";
import { useLoginContext } from "../context/loginContext/LoginContext";

import Image from "next/image";

import "../globals.css";

//www.esperancaparaocoracao.org
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const { employee } = useLoginContext()

  const router = useRouter()
  const path = usePathname()
  const page:any = checkPath(path)

  useEffect(() => {
    const listNav = document.querySelectorAll(`.nav-item-list`)

    listNav.forEach((item:any) => {
      if (item.classList.contains(page)) {
        item.style.color = '#94a3b8' ///color: rgb(241 245 249)
      } else {
        item.style.color = '#ffffff' 
      }
    })
  }, [page]);
  
  return (
    <PedidoContextProvider>
      <div className="container-mai flex justify-center items-center w-svw h-svh">
        <div className="container-app flex w-full">
          
          <div className="side-bar flex gap-2 justify-center items-center w-64 h-svh bg-black">
            <div className="nav-bar flex flex-col justify-start gap-28 items-center w-full h-full p-4">
              <Image 
                src={'/logo.png'}
                width={150}                              
                height={150}
                alt="Logo da impresa"
              />              
              <ul className="nav-list flex flex-col gap-3">
                <li className="painel nav-item-list text-slate-50 cursor-pointer hover:text-slate-100" onClick={() => {router.push('/pages/painel')}}>PAINEL</li>
                <li className="agenda nav-item-list text-slate-50 cursor-pointer hover:text-slate-100" onClick={() => {router.push('/pages/agenda')}}>AGENDA</li>
                <li className="pedido nav-item-list text-slate-50 cursor-pointer hover:text-slate-100" onClick={() => {router.push('/pages/pedido')}}>PEDIDO</li>
                { (employee?.employeePermitionType === 'dev') && <li className="menudev nav-item-list text-slate-50 cursor-pointer hover:text-slate-100" onClick={() => {router.push('/pages/menudev')}}>DESENVOLVEDOR</li>}
              </ul>
            </div>
          </div>
          <div className="content-app flex w-full h-svh p-2 bg-black">
            <div className="relative box-content flex flex-col justify-center items-center w-full rounded-lg bg-white">
              <div className="absolute flex justify-between w-full top-0 pl-3 pt-1 pr-3">
                <h1>{page?.toUpperCase()}</h1>
                <h1 className="text-xs text-zinc-700">{employee?.employeeName}</h1>
              </div>
              <div className="flex justify-center items-end w-full h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PedidoContextProvider>
  );
}
