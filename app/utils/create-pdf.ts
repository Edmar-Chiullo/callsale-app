import jsPDF from 'jspdf'

function calcFullValue(value:any, QValue:any) {
    const result = Number(QValue) * Number(value)
    return result
}

export function createPDF(order:any, orderItens:any, client:any) {
    const arr = orderItens
    const fullValueNote = arr.map(({productUnitaryValue, productQuantity}:any) => calcFullValue(productUnitaryValue, productQuantity)).reduce((calc=0, value=0) => calc + value)
    
    var doc = new jsPDF();

    //Cabeçalho...
    doc.addImage("/logoPDF.png", 10, 3, 24, 24)
    doc.setFontSize(9)

    doc.text(`Data: ${order.orderDate.slice(0,2)}/${order.orderDate.slice(2,4)}/${order.orderDate.slice(4,8)}`, 145, 15)
    doc.text(`Hora: ${order.orderHour.slice(0,2)}:${order.orderHour.slice(2,4)}:${order.orderHour.slice(4,6)}`, 175, 15)
    
    doc.text(`Cód. Pedido: ${order.orderId}`, 15, 50)

    doc.text(`Cod. Cliente: ${order.orderCliCOD}      Nome: ${order.orderFantasia}     Cidade: ${client.clientCity}`, 15, 57)
    doc.line(15, 58, 195, 58, 'DF')

    //Corpo...
    let countItens = 0
    let positionYItens = 100
    doc.text(`Item      Cód. Produto        Descrição                                                                   Valor Uni.      Qtd        IPI        ST           Total`, 15, 100)
    doc.setFontSize(7)
    
    arr.map(({productCod, productDescription, productIPI, productQuantity, productST, productUnitaryValue}:any) => {
        positionYItens = positionYItens + 4
        countItens++
        doc.text(`${countItens}               ${productCod}                ${productDescription}                R$ ${productUnitaryValue}               ${productQuantity}              ${productIPI}%           ${productST}%               R$ ${calcFullValue(productUnitaryValue, productQuantity).toFixed(2)}`, 15, positionYItens)
        doc.line(0, positionYItens + 2, 0, positionYItens + 2)
        doc.line(15, positionYItens + 1, 195, positionYItens + 1, 'DF')
    })

    //Rodapé...
    doc.setFontSize(8)
    doc.text(`Valor Total: R$ ${fullValueNote}`, 164, 269)
    doc.line(15, 270, 195, 270, 'DF')

    doc.save(`PED_${order.orderFantasia}.pdf`)
}