export interface EmployeeProps {
    employeeId: number
	employeeName: string | null
	employeePermissionType: string
}

export interface ProductProps {
    productId: number
	productCod: string
	productDescription: string
	productType: string
	productUnitValor: number
	produtRepresented: string
}

export interface OrderProps {
    orderId: number
    orderEmployeeId: number
    orderEmployeeName: string
    orderItem: string
    orderProductId: string
    orderProductCod: string
    orderDate: Date
}

export interface TaskProps {
    taskId: number
    taskEmployeeId: number
    taskEmployeeName: string
    taskInsertionDate: Date
    taskDescription: string
    taskDateAgenda: Date
}
