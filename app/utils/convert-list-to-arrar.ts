import { ItemOrder } from "../class/classes";

export function convertListToArray(
    list:any /** Parâmetro vair receber um objeto array*/
) {
    const arr:any = []
    
    list.forEach((item:any) => {
        const itemList = new ItemOrder(item)
        arr.push(itemList)
    })

    return arr 
}