import { StockInfo, StockListItem } from "./db/stocks.ts";
import { LayerSwitcher } from "./appLayer.ts";
import { EventSystem } from "./utils.ts";
import * as db from "./db"

export class StockDB extends LayerSwitcher {
    public currentStock: StockInfo | undefined = undefined;
    public events: EventSystem;
    public stockItemList: Array<StockListItem> | undefined;

    constructor(navContainer: HTMLElement, mainContainer: HTMLElement) {
        super(navContainer, mainContainer);
        this.events = new EventSystem();
        this.updateStockList();

    }

    initalize() {

    }

    public get StockDB() {
        return this;
    }

    public set stock(stock: StockInfo){
        this.currentStock = stock;
        this.events.post("stockChange");
    }


    updateStockList() {
        db.getAllStocks()
        .then(stockListItems => {
            if (stockListItems === null) {
                return;
            }

            // Clear list
            this.stockItemList = [];

            stockListItems.forEach((item) => {
                // Should the dropdown item instead recieve the id instead of ticker
                this.stockItemList?.push(item);
            })

            this.events.post("stockListUpdate");
        })


        
    }
    
}
