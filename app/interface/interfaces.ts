export interface EmployeeProps {
    employeeId: number | null
	employeeName: string | null
	employeePermitionType: string | null// Typo de permissão que o usuário possui. admin (Gestor) | fun (Funcionátio)
    employeePassword: string | null
}

export interface ClientProps {
    clientCode: number | null,
    clientName: string | null// Typo de permissão que o usuário possui. admin (Gestor) | fun (Funcionátio),
    clientAlias: string | null,
    clientCity: string | null,
    clientActing: string | null
}

export interface ProductProps {
	productCod: string | null // Código da empresa fornecedora.
	productDescription: string | null
	productType: string | null
    productNCM: string | null
    productAplication: string | null
	productUnitValue: number | null
	productRepresented: string | null // Qual empresa fornece o produto
    productStatus: string | null //Tipos de status. c_estoque | s_estoque | finalizado.
}

export interface ProductPropss {
	productCod: string | null // Código da empresa fornecedora.
	productDescription: string | null
	productType: string | null
	productUnitValue: number | null
	productRepresented: string | null // Qual empresa fornece o produto
    productStatus: string | null //Tipos de status. c_estoque | s_estoque | finalizado.
}

export interface ItemOrderProps {
	productCod: string | null // Código da empresa fornecedora.
	productDescription: string | null
	productUnitaryValue: string | null
	productQuantity: string | null
    productIPI: string | null
    productST: string | null
    
}

export interface OrderProps {
    orderId: string | null
    orderEmployeeId: number | null
    orderEmployeeName: string | null
    orderDate: string | null
    orderHour: string | null
    orderValue: number | null
    orderStatus: boolean | null // Tipos de status. Concluido | Cancelada | Pendente.
}

export interface TaskProps {
    taskId: string | null
    taskEmployeeId: string
    taskEmployeeName: string
    taskTitle: string
    taskDescription: string
    taskAgendaDate: string // Data em que a tarefa foi agendada.
    taskAgendaHour: string // Hora em que a tarefa foi agendada.
    taskRegisterDate: string // Data do cadastro
    taskAgendaState: boolean // Tipos de status Concluida | Cancelada | Pendente. 
}
