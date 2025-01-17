export interface EmployeeProps {
    employeeId: number | null
	employeeName: string | null
	employeePermitionType: string | null// Typo de permissão que o usuário possui. admin (Gestor) | fun (Funcionátio)
}

export interface ClientProps {
    cliCOD: number | null,
    razao: string | null// Typo de permissão que o usuário possui. admin (Gestor) | fun (Funcionátio),
    fantasia: string | null,
    cidade: string | null,
    atuacao: string | null
}

export interface ProductProps {
    productId: number | null
	productCod: string | null // Código da empresa fornecedora.
	productDescription: string | null
	productType: string | null
	productUnitValor: number | null
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
    orderDate: Date | null
    orderStatus: boolean | null // Tipos de status. Concluido | Cancelada | Pendente.
}

export interface TaskProps {
    taskId: string
    taskEmployeeId: number
    taskEmployeeName: string
    taskTitle: string
    taskDescription: string
    taskAgendaDate: string // Data em que a tarefa foi agendada.
    taskRegisterDate: string // Data do cadastro
    taskAgendaStatus: string // Tipos de status Concluida | Cancelada | Pendente. 
}
