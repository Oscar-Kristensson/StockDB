import { StockInfo, StockListItem } from "./db/stocks.ts";
import { LayerSwitcher } from "./appLayer.ts";
import { EventSystem } from "./utils.ts";
import * as db from "./db"
import * as utils from "./utils.ts"

export class StockDB extends LayerSwitcher {
    public currentStock:  utils.SmartVar<StockInfo | undefined>;
    public events: EventSystem;
    public stockItemList: Array<StockListItem> | undefined;

    constructor(navContainer: HTMLElement, mainContainer: HTMLElement) {
        super(navContainer, mainContainer);
        this.events = new EventSystem();
        this.currentStock = new utils.SmartVar(undefined);
        this.updateStockList();

    }

    initalize() {

    }

    public get StockDB() {
        return this;
    }

    public set stock(stock: StockInfo | undefined){
        this.currentStock.value = stock;
        this.events.post("stockChange");
    }

    public get stock() {
        return this.currentStock.value;
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
