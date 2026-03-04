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

    public set stock(stock: StockInfo | undefined){
        this.currentStock = stock;
        this.events.post("stockChange");
    }


    setStock(id: number | undefined) {
        if (!id) {
            this.stock = undefined;
            return;
        }

        db.getStockInfoById(id)
        .then(result => {
            if (!(result instanceof StockInfo)) {
                throw new Error("The result was not a stock");
            }

            this.stock = result;
        })
        .catch(error => {
            console.error("Error occured when fetching stock from database", error);
        })
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
