import { EmployeeProps, OrderProps, ProductProps, TaskProps } from "../interface/interfaces";

export class Employee {    
    employeeId: number
    employeeName: string | null
    employeePermissionType: string

    constructor (props: EmployeeProps ) {
        this.employeeId = props.employeeId
        this.employeeName = props.employeeName
    	this.employeePermissionType = props.employeePermissionType
    }
}

export class Product {
    productId: number
	productCod: string
	productDescription: string
	productType: string
	productUnitValor: number
	produtRepresented: string

    constructor (props: ProductProps) {
        this.productId = props.productId
        this.productCod = props.productCod
        this.productDescription = props.productDescription
        this.productType = props.productType
        this.productUnitValor = props.productUnitValor
        this.produtRepresented = props.produtRepresented
    }
}

export class Order {
    orderId: number
    orderEmployeeId: number
    orderEmployeeName: string
    orderItem: string
    orderProductId: string
    orderProductCod: string
    orderDate: Date

    constructor(props: OrderProps) {
        this.orderId = props.orderId
        this.orderEmployeeId = props.orderEmployeeId
        this.orderEmployeeName = props.orderEmployeeName
        this.orderItem = props.orderItem
        this.orderProductId = props.orderProductId
        this.orderProductCod = props.orderProductCod
        this.orderDate = props.orderDate
    }
}

export class Task {
    taskId: number
    taskEmployeeId: number
    taskEmployeeName: string
    taskInsertionDate: Date
    taskDescription: string
    taskDateAgenda: Date

    constructor(props: TaskProps) {
        this.taskId = props.taskId
        this.taskEmployeeId = props.taskEmployeeId
        this.taskEmployeeName = props.taskEmployeeName
        this.taskInsertionDate = new Date(props.taskInsertionDate)
        this.taskDescription = props.taskDescription
        this.taskDateAgenda = props.taskDateAgenda
    }
}