

export function checkPath(props:string) {
    switch (props) {
        case '/pages/painel':
            const painel = 'painel'
            return painel  

        case '/pages/agenda':
            const agenda = 'agenda'
            return agenda  
                  
        case '/pages/pedido':
            const pedido = 'pedido'
            return pedido  

            default:
            break;
    }
}