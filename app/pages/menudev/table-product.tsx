
export default function PrintProducts(productList:[]) {

    return (
        <div className="flex flex-col gap-2">
            <div className="w-full h-2">
                <ul className="flex gap-2">
                    <li>Código</li>
                    <li>Descrição</li>
                    <li></li>
                    <li></li>
                </ul>
            </div>

            <ul>
                {
                    productList.map((product:any, i:any) => {
                            return <li key={i}>{product}</li>
                        })
                }
            </ul>

        </div>
    )
}