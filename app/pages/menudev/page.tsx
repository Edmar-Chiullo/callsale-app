'use client'

import { Product, ProductS } from "@/app/class/classes"
import { ProductProps } from "@/app/interface/interfaces"
import { createProduct, createProductS } from "@/app/controler-firebase/realtime-database"
import { loadExcelAsJson } from "@/app/utils/read-file"
import { useLoginContext } from "@/app/context/loginContext/LoginContext"
import { clienteCarteira } from "@/data/tabela-cliente"
import { createClient } from "@/app/controler-firebase/realtime-database"
import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ManegerFiles() {
    const { employee } = useLoginContext()
    const router = useRouter()
 
    const [file, setFile] = useState<any>()
    const [printFile, setPrintFile] = useState(false)
    const [listProduct, setListProduct] = useState<[]>([])
    const [represented, setRepresented] = useState('')

    useEffect(() => {
        if (!employee?.employeeName) router.push('/')
      }, [])

    useEffect(() => {
        if (file) file.then((result:any) => {
            transformData(result)
        })
    }, [file])

    function transformData(list:any) {
        const objects:any = []
        switch (represented) {
            case 'GLR':
                for (const element of list) {
                    const { codigo, tipo, aplicacao, descricao, valor, ncm } = element
        
                    const product = new Product({ codigo, tipo, aplicacao, descricao, valor, ncm })
                    product.updateStatus('c_estoque')
                    product.updateRepresented(represented)
        
                    objects.push(product)
                }                
                break;
            case "SONGLE":
                for (const element of list) {
                    const { songle, arpe, descricao, valor } = element
        
                    const product = new ProductS({ songle, arpe, descricao, valor })
                    product.updateStatus('c_estoque')
                    product.updateRepresented(represented)
        
                    objects.push(product)
                }                
                break
        
            default:
                break;
        }

        setListProduct(objects)
        setPrintFile(true)
    }

    function loadFile(value:any) {
        const result = value.target.innerText
        const reprensentada = result.split(' ')
        setRepresented(reprensentada[2])
        setFile(loadExcelAsJson())
    }

    function setProduct() {
        switch (represented) {
            case 'GLR':
                for (const product of listProduct) {
                    createProduct(product)
                }                
                break;

            case 'SONGLE':
                for (const product of listProduct) {
                    createProductS(product)
                }                
                break;
            
            default:
                break;
        }

        setRepresented('')
    }

    function addClient() {
        for (const client of clienteCarteira) {
            createClient(client)
        }
    }

    return (
        <div className="flex flex-col justify-center items-start w-full h-[75%] pb-3 gap-3 overflow-y-scroll list-none">
            {printFile && <Button onClick={setProduct} className="self-end w-28 mr-3">Exportar</Button>}
            {printFile && <div className="flex justify-between w-full gap-2 pl-2 pr-3">
                        <div className="flex flex-col gap-2 w-full mb-1">
                            <div className="w-full h-2">
                                <ul className="grid grid-cols-12 w-full bg-zinc-950 text-slate-50 pl-2 pr-2 rounded-sm">
                                    <li className="col-start-1 col-end-2">Código</li>
                                    <li className="col-start-3 col-end-9">Descrição</li>
                                    <li className="col-start-10 col-end-12">Valor</li>
                                </ul>
                            </div>
                        </div>
                    </div>}
            {printFile &&
                <div className="relative flex flex-col items-end gap-3 w-full h-[95%] overflow-y-scroll list-none">
                    {listProduct.map(({productCod, productDescription, productUnitValue }, i) => {
                        return (
                            <div key={i} className="grid grid-cols-12 w-full h-4 pl-5">
                                <li className="col-start-1 col-end-2">{`${productCod}`}</li>
                                <li className="col-start-3 col-end-9">{`${productDescription}`}</li>
                                <li className="col-start-10 col-end-12">{`R$ ${Number(productUnitValue).toFixed(2)}`}</li>
                            </div>
                        )
                        
                    })}
                </div> 
            }
            {!printFile &&
                <div className="flex flex-col gap-4 justify-center items-center w-full h-[30%]">
                    <Button onClick={(value) => loadFile(value)} className="w-96">Carregar arquivo GLR</Button>
                    <Button onClick={(value) => loadFile(value)} className="w-96">Carregar arquivo SONGLE</Button>
                    <Button onClick={addClient} className="w-96">Adicionar Cliente</Button>
                </div>
            }
        </div>
    )
}