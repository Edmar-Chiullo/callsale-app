import jsPDF from 'jspdf'


function calcFullValue(value:any, QValue:any) {
    const result = Number(QValue) * Number(value)
    return result
}

export function createPDF(order:any, orderItens:any) {
    const arr = orderItens

    var doc = new jsPDF();

    //Cabeçalho...
    doc.addImage("/logoPDF.png", 10, 3, 24, 24)
    doc.setFontSize(9)
    doc.text(`Cód. Pedido: ${order.orderId}`, 15, 50)

    doc.text(`Cod. Cliente: ${order.orderCliCOD}      Nome: ${order.orderFantasia}     Cidade: `, 15, 55)

    //Corpo...
    let countItens = 0
    let positionItens = 100
    doc.setFontSize(8)
    
    arr.map(({productCod, productDescription, productIPI, productQuantity, productST, productUnitaryValue}:any) => {
        positionItens = positionItens + 4
        countItens++
        doc.text(`${countItens} - ${productCod} - ${productDescription} - ${productUnitaryValue} - ${productQuantity} - ${productIPI}% - ${productST}% - ${calcFullValue(productUnitaryValue, productQuantity)}`, 15, positionItens)
        doc.line(0, positionItens + 2, 0, positionItens + 2)
    })

    //Rodapé...


    doc.save(`PED_${order.orderFantasia}.pdf`)

}