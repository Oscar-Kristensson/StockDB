import { StockInfo } from "./stocks.ts";
import { LayerSwitcher } from "./appLayer.ts";
import { EventSystem } from "./utils.ts";

export class StockDB extends LayerSwitcher {
    public currentStock: StockInfo | undefined = undefined;
    public eventSystem: EventSystem;
    constructor(navContainer: HTMLElement, mainContainer: HTMLElement) {
        super(navContainer, mainContainer);
        this.eventSystem = new EventSystem();
    }

    initalize() {

    }

    public get StockDB() {
        return this;
    }

    public set stock(stock: StockInfo){
        this.currentStock = stock;
        this.eventSystem.post("stockChange");
    }
    
}
