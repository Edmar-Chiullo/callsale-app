import { ItemOrderProps } from "../interface/interfaces"

class NodeList {
    item: ItemOrderProps | undefined
    nextItem: ItemOrderProps | any
    constructor(product: ItemOrderProps) {
        this.item = product
        this.nextItem = undefined
    }
}

class ItemList {
    count: number
    head: NodeList | undefined
    constructor() {
        this.count = 0
        this.head = undefined
    }

    pushItem(product: ItemOrderProps) {
        const item = new NodeList(product)
        let currentItem
        if (this.head == null) {
            this.head = item
        } else {
            currentItem = this.head
            while (currentItem.nextItem != null) {
                currentItem = currentItem.nextItem
            }            
            currentItem.nextItem = item
        }
        this.count++
    }

    getLastItem() {
        let currentItem:any
        if (this.count == 0) {
            return false
        } else {
            currentItem = this.head
            while (currentItem.nextItem != null) {
                currentItem = currentItem.nextItem
            }            
            return currentItem
        }
    }

    removeItem(item: number) {
        if (item >= 0 && item < this.count) {
            let currentItem = this.head
            if (item === 0) {
                this.head = currentItem?.nextItem
            } else {
                let previous
                for (let i = 0; i < item; i++) {
                    previous = currentItem
                    currentItem = currentItem?.nextItem
                }
                if (previous?.nextItem) previous.nextItem = currentItem?.nextItem
            }
            this.count--
            return currentItem?.item
        }
        return undefined
    }
}

export default ItemList