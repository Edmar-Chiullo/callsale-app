
export default function stractOrderList(list:any) {
    const listOrder:any = []
    for(const order of list) {
        const values = Object.values(order)
        values.map(({ order }:any) => listOrder.push(order))
    }
    return listOrder
}