import { StockInfo, StockListItem } from "./db/stocks.ts";
import { LayerSwitcher } from "./appLayer.ts";
import * as db from "./db"
import * as utils from "./utils"
import * as economy from "./economy"

export class StockDB extends LayerSwitcher {
    public currentStock:  utils.SmartVar<economy.Stock | undefined>;
    public events: utils.EventSystem;
    public stockItemList: utils.SmartVar<Array<StockListItem> | undefined>;

    constructor(navContainer: HTMLElement, mainContainer: HTMLElement) {
        super(navContainer, mainContainer);
        this.events = new utils.EventSystem();
        this.currentStock = new utils.SmartVar<economy.Stock | undefined>(undefined, (value) => {
            return value instanceof economy.Stock || typeof value === "undefined";
        });

        this.stockItemList = new utils.SmartVar<Array<StockListItem> | undefined>(undefined);
        this.updateStockList();

    }

    initalize() {

    }

    public get StockDB() {
        return this;
    }

    public set stock(stock: economy.Stock | undefined){
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

            const stock = new economy.Stock(result);
            this.stock = stock;

            // Testing code
            const act = () => {
                console.log("Act:", stock);


                

            }
            stock.event.listen("update.info", act);
            stock.event.listen("update.data", act);
            stock.event.listen("update.data", () => {
                if (!stock.data) return;

                console.log("Loaded Q reports")

                const currentQuarter = utils.getCurrentQuarter();
                const year = new Date().getFullYear()
                const totalPeriod = utils.calcTotalPeriod(year, currentQuarter);

                economy.StockStatistics.fromQuarterlyReports(stock.data, totalPeriod - 1);
            });
            stock.loadInfo();
            stock.loadData();
            
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
            this.stockItemList.setValue([]);

            

            stockListItems.forEach((item) => {
                // Should the dropdown item instead recieve the id instead of ticker
                this.stockItemList.value?.push(item);
            })

            this.events.post("stockListUpdate");
        })


        
    }
    
}
