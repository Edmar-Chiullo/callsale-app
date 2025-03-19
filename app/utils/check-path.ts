
/**
 * Esta função faz a checagem da página atual da aplicação para realizar do path.
 * Permitindo a mudança como a cor do titulo da página atual e outros controles via path.   
 */
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
            
        case '/pages/pedido/detalhe-pedido':
            const dtelhePedido = 'pedido'
            return dtelhePedido  

        case '/pages/menudev':
            const dev = 'menudev'
            return dev  
    
            default:
            break;
    }
}