'use client'

import { usePathname } from "next/navigation";

import { Employee } from "@/app/class/classes"
import { useLoginContext } from "@/app/context/loginContext/LoginContext"

import "../globals.css";
import { checkPath } from "../utils/check-path";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { employeeName }:Employee = useLoginContext()
    const path = usePathname()
    const page = checkPath(path)

    const btnMenu:any = document.querySelector('.painel')
    btnMenu.style.color = '#94a3b8'

    return (
        <div className="container-mai flex justify-center items-center w-svw h-svh">
          <div className="container-app flex w-full">
            <div className="side-bar flex gap-2 justify-center items-center w-64 h-svh bg-black">
              <div className="nav-bar flex justify-center items-center w-full h-40">
                <ul className="nav-list flex flex-col gap-3">
                  <li className="painel nav-item-list text-white cursor-pointer hover:text-slate-400">PAINEL</li>
                  <li className="agenda nav-item-list text-white cursor-pointer hover:text-slate-400">AGENDA</li>
                  <li className="pedido nav-item-list text-white cursor-pointer hover:text-slate-400">PEDIDO</li>
                </ul>
              </div>
            </div>
            <div className="content-app flex w-full h-svh p-2 bg-black">
              <div className="relative box-content flex flex-col justify-center items-center w-full rounded-lg bg-white">
                <div className="absolute flex justify-between w-full top-0 p-2">
                  <h1>Home</h1>
                  <h1>{employeeName}</h1>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
  );
}
