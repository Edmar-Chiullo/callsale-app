import { ProductProps } from "../interface/interfaces";
import { undefined } from "./item-list";

export class NodeList {
    item: ProductProps | undefined;
    nextItem: {} | undefined;
    constructor(product: ProductProps) {
        this.item = product;
        this.nextItem = undefined;
    }
}
