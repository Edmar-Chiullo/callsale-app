'use client'

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Employee } from "@/app/class/classes"
import { useLoginContext } from "@/app/context/loginContext/LoginContext"
import { checkPath } from "../utils/check-path";

import "../globals.css";

//www.esperancaparaocoracao.org
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { employeeName }:Employee = useLoginContext()

    const router = useRouter()
    const path = usePathname()
    const page:any = checkPath(path)

    useEffect(() => {
      const listNav = document.querySelectorAll(`.nav-item-list`)
      listNav.forEach(item => {
        if (item.classList.contains(page)) {
          item.style.color = '#94a3b8'
        } else {
          item.style.color = '#ffffff' 
        }
      })
    }, [page]);
    
    return (
        <div className="container-mai flex justify-center items-center w-svw h-svh">
          <div className="container-app flex w-full">
            <div className="side-bar flex gap-2 justify-center items-center w-64 h-svh bg-black">
              <div className="nav-bar flex justify-center items-start w-full h-96 p-4">
                <ul className="nav-list flex flex-col gap-3">
                  <li className="painel nav-item-list text-white cursor-pointer hover:text-slate-400" onClick={() => {router.push('/pages/painel')}}>PAINEL</li>
                  <li className="agenda nav-item-list text-white cursor-pointer hover:text-slate-400" onClick={() => {router.push('/pages/agenda')}}>AGENDA</li>
                  <li className="pedido nav-item-list text-white cursor-pointer hover:text-slate-400" onClick={() => {router.push('/pages/pedido')}}>PEDIDO</li>
                </ul>
              </div>
            </div>
            <div className="content-app flex w-full h-svh p-2 bg-black">
              <div className="relative box-content flex flex-col justify-center items-center w-full rounded-lg bg-white">
                <div className="absolute flex justify-between w-full top-0 p-2">
                  <h1>{page?.toUpperCase()}</h1>
                  <h1>{employeeName}</h1>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
  );
}
