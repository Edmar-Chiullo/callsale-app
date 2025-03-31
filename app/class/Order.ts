import { ClientProps, OrderProps } from "../interface/interfaces";
import { fullDate } from "../utils/create-date";
import { Employee } from "./classes";


// export class Order {
//     orderId: string | null
//     orderEmployeeId: number | null
//     orderEmployeeName: string | null
//     orderCliCOD: number | null
//     orderValue: string | null
//     OrderFantasia: string | null
//     orderDate: Date | null
//     orderStatus: string

//     constructor(employee: Employee, client: ClientProps) {
//         this.orderId = fullDate()
//         this.orderEmployeeId = employee.employeeId
//         this.orderEmployeeName = employee?.employeePermitionType
//         this.orderCliCOD = client.cliCOD
//         this.orderValue = null
//         this.OrderFantasia = client.fantasia
//         this.orderDate = new Date()
//         this.orderStatus = ''
//     }

//     status({ status }: { status: string; }): void {
//         this.orderStatus = status
//     }

//     value({ value }: {value: string}): void {
//         this.orderValue = value
//     }
// }
