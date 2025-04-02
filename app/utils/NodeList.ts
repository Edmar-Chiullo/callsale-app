import { ProductProps } from "../interface/interfaces";

export class NodeList {
    item: ProductProps | undefined;
    nextItem: {} | undefined;
    constructor(product: ProductProps) {
        this.item = product;
        this.nextItem = undefined;
    }
}
