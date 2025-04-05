import { OrderProps } from "../interface/interfaces"

export class AlterOrder {
    orderCliCOD: number | null
    orderDate: Date | null
    orderId: number | null
    orderEmployeeId: number | null
    orderEmployeeName: string | null
    orderFantasia: string | null
    orderHour: string | null
    orderValue: number | null
    orderStatus: boolean | null | string
    orderConfirmDate: string | null
    orderObservation: string | null


    constructor(order: OrderProps | any) {
        this.orderCliCOD = order.orderCliCOD
        this.orderDate = order.orderDate        
        this.orderId = order.orderId
        this.orderEmployeeId = order.orderEmployeeId
        this.orderEmployeeName = order.orderEmployeeName
        this.orderFantasia = order.orderFantasia
        this.orderHour = order.orderHour
        this.orderValue = order.orderValue
        this.orderStatus = order.orderStatus
        this.orderConfirmDate = null
        this.orderObservation = null

    }

    setState(status: boolean | string): void {
        this.orderStatus = status
    }

    setObservation(value:string): void {
        this.orderObservation = value
    } 

    setConfirmDate(value: string): void {
        this.orderConfirmDate = value
    }
}
