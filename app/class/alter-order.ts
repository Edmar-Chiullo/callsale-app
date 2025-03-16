
export class AlterOrder {
    orderCliCOD: number | null
    orderDate: Date | null
    orderId: number | null
    orderEmployeeId: number | null
    orderEmployeeName: string | null
    orderFantasia: string | null
    orderHour: string | null
    orderValue: number | null
    orderStatus: boolean | null

    constructor(order: any) {
        this.orderCliCOD = order.orderCliCOD
        this.orderDate = order.orderDate        
        this.orderId = order.orderId
        this.orderEmployeeId = order.orderEmployeeId
        this.orderEmployeeName = order.orderEmployeeName
        this.orderFantasia = order.orderFantasia
        this.orderHour = order.orderHour
        this.orderValue = order.orderValue
        this.orderStatus = order.orderStatus
    }

    setState(status: boolean): void {
        this.orderStatus = status
    }
}
