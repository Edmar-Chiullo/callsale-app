import jsPDF from 'jspdf'

function calcFullValue({ ...value }:any) {
    
    const unitValue = Number(value.unitaryValue)
    const ipi = Number(value.ipi.replace(',','.'))
    const st = Number(value.st.replace(',','.'))

    const resultIPI =  unitValue + ((unitValue * ipi)/ 100)
    const resultST = ((resultIPI * st) / 100)

    const result = resultIPI + resultST
    const quantity = Number(value.qt);

    return isNaN(value.unitaryValue) || isNaN(quantity) ? null : (quantity * result)
}

export function createPDF(order:any, orderItens:any, client:any) {
    const arr = orderItens
    const fullValueNote = arr.map(({productUnitaryValue, productQuantity, productIPI, productST}:any) => {const vlue = calcFullValue({
                                                                                                                        unitaryValue:productUnitaryValue, 
                                                                                                                        qt:productQuantity,
                                                                                                                        st:productST,
                                                                                                                        ipi:productIPI
                                                                                                                    }) 
                                                                                                                    return vlue}).reduce((calc=0, value=0) => calc + value)
    
    var doc = new jsPDF();

    //Cabeçalho...
    doc.addImage("/logoPDF.png", 10, 3, 24, 24)
    doc.setFontSize(9)

    doc.text(`Data: ${order.orderDate.slice(0,2)}/${order.orderDate.slice(2,4)}/${order.orderDate.slice(4,8)}`, 145, 15)
    doc.text(`Hora: ${order.orderHour.slice(0,2)}:${order.orderHour.slice(2,4)}:${order.orderHour.slice(4,6)}`, 175, 15)
    
    doc.text(`Cód. Pedido: ${order.orderId}`, 15, 50)

    doc.text(`Cod. Cliente: ${order.orderCliCOD}`, 15, 57)
    doc.text(`Nome: ${order.orderFantasia}`, 50, 57)
    doc.text(`Cidade: ${client.clientCity}`, 115, 57)
    doc.line(15, 58, 195, 58, 'DF')

    //Corpo...
    let countItens = 0
    let positionYItens = 100
    doc.text(`Item`, 15, 100)
    doc.text(`Cód. Produto`, 27, 100)
    doc.text(`Descrição`, 52, 100)
    doc.text(`Valor Uni.`, 126, 100)
    doc.text(`Qtd`, 147, 100)
    doc.text(`IPI`, 156, 100)
    doc.text(`ST`, 169, 100)
    doc.text(`Total`, 183, 100)
    doc.setFontSize(7)
    
    arr.map(({productCod, productDescription, productIPI, productQuantity, productST, productUnitaryValue}:any) => {
        const fullValue = calcFullValue({
            ipi:productIPI,
            st:productST,
            unitaryValue:productUnitaryValue,
            qt:productQuantity
        })
        positionYItens = positionYItens + 4
        countItens++
        doc.text(`${countItens}`, 17, positionYItens)
        doc.text(productCod, 27, positionYItens)
        doc.text(productDescription, 52, positionYItens)
        doc.text(`R$ ${productUnitaryValue}`, 126, positionYItens)
        doc.text(productQuantity, 147, positionYItens)
        doc.text(`${productIPI}%`, 156, positionYItens)
        doc.text(`${productST}%`, 169, positionYItens)
        doc.text(`R$ ${fullValue?.toFixed(2)}`, 183, positionYItens)

        doc.line(0, positionYItens + 2, 0, positionYItens + 2)
        doc.line(15, positionYItens + 1, 195, positionYItens + 1, 'DF')
    })

    //Rodapé...
    doc.setFontSize(8)
    doc.text(`Total:     R$ ${fullValueNote.toFixed(2)}`, 166, 269)
    doc.line(15, 270, 195, 270, 'DF')

    doc.save(`PED_${order.orderFantasia}.pdf`)
}