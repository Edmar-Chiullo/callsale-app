'use client'

import { useContext } from "react";
import { LoginContext } from "../context/loginContext/LoginContext";

export default function Card() {
    const context = useContext(LoginContext)
    const { name }:any = context

    return <div className="w-20 h-10 rounded-md hover:bg-slate-50 text-black text-center bg-white">{`${name}`}</div> 
}