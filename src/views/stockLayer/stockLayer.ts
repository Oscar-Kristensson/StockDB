import { AppLayer } from "../../appLayer.ts";
import { CustomContainer } from "../../components/container.ts";
import { CustomTable } from "../../components/table.ts";
import { CustomStockInfo } from "../../components/stockInfo.ts";
import { StockInfo } from "../../db/stocks.ts";
import { StockDB } from "../../app.ts";
import { CustomLabelElement } from "./customLabel.ts";
import * as utils from "../../utils.ts"
import { QuarterlyReport } from "../../db/quarterly.ts";
import * as db from "../../db"


class StockLayer extends AppLayer {
    container: HTMLElement | undefined;
    graphContainer: CustomContainer | undefined;
    overviewContainer: CustomContainer | undefined;
    informationContainer: CustomContainer | undefined;
    stockInfo: CustomStockInfo | undefined;
    overviewTable: CustomTable | undefined;

    stock: StockInfo | undefined;
    app: StockDB | undefined;

    quarterlyRecords?: Array<QuarterlyReport>

    averageRevenue: utils.SmartVar<string>;
    averageRevenueElement: CustomLabelElement;


    constructor() {
        super("Stocks", "icons/StockIcon.svg");

        this.averageRevenueElement = new CustomLabelElement(undefined, "Unkown");
        
        this.averageRevenue = new utils.SmartVar<string>("Unkown", () => {
            if (this.averageRevenueElement)
                this.averageRevenueElement.content.innerText = this.averageRevenue.value;
        })


    }

    createUI() {

        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }
        this.container = document.createElement("div");
        this.container.className = "stockLayer";


        this.stockInfo = new CustomStockInfo(this.container, "stockInfo");

        this.graphContainer = new CustomContainer(this.container, "Graph", "graphContainer")
        this.overviewContainer = new CustomContainer(this.container, "Overview", "overviewContainer");
        this.informationContainer = new CustomContainer(this.container, "Info", "informationContainer");



        this.overviewTable = new CustomTable(this.overviewContainer, "informationTable", 5);

        this.generateStockOverViewTable(120);


        

        

    }

    /**
     * Called only once
     */
    receivedApp() {
        if (this.layerSwitcher instanceof StockDB) {
           this.app = this.layerSwitcher; 
        } else {
            this.app = undefined;
        }


        // Inorder for hte StockLayer to auto update the stock if it is changed
        if (this.app) {
            this.app.eventSystem.listen("stockChange", () => {
                if (this.app 
                    && this.app.currentStock 
                    && this.app.currentLoadedLayer === this) {
                    this.setStock(this.app.currentStock);
                }
            });            

        } else {
            console.warn("Could not add a listner since this.layerSwicther is not StockDB");
        }
    }

    /**
     * Is called when the app layer is switched
     * @returns 
     */
    override onLoad(): HTMLElement | undefined {
        if (!this.app)
            this.receivedApp();

        this.createUI();

        if (this.app?.currentStock) {
            this.setStock(this.app.currentStock);
        }

        return this.container;
    }

    setStock(stock: StockInfo) {
        this.stock = stock;
        
        if (!this.stockInfo) {
            console.warn("Could not complete setting the stock because the UI was not yet created, please call onLoad or createUI before setting the stock");
            return;
        }
        this.stockInfo.setStock(this.stock)

        db.getQuarterlyFromStockID(this.stock.id)
            .then(result => {
                if (result instanceof Array) {
                    this.quarterlyRecords = result;

                    this.averageRevenue.value = String(utils.averageO(this.quarterlyRecords, (record: QuarterlyReport) => {
                        if (record.revenue === null) {
                            return 0;
                        }
                            
                        return record.revenue;
                    }))

                    
                }
            })
            .catch(error => {
                console.error("An error occured whilst reading quarterly records", error);
            })

        



    }

    generateStockHeading() {
        if (!this.container)
            return;
        this.stockInfo = new CustomStockInfo(this.container, "stockInfo");
    }


    


    generateStockOverViewTable(
        revenue: number,
    ) {
        if (!(this.overviewTable instanceof CustomTable)) {
            console.error("The overview table is not correctly initalized!");
            return;
        }

        this.overviewTable.addRow([
            new CustomLabelElement(undefined, ""),
            new CustomLabelElement(undefined, "Latest"),
            new CustomLabelElement(undefined, "1 year"),
            new CustomLabelElement(undefined, "5 years"),
            new CustomLabelElement(undefined, "10 years"),
        ], true);


        this.overviewTable.addRow([
            new CustomLabelElement(undefined, "Revenue"),
            this.averageRevenueElement,
            new CustomLabelElement(undefined, ""),
            new CustomLabelElement(undefined, ""),
            new CustomLabelElement(undefined, ""),
        ], false);


        

        for (let i = 0; i < 100; i++) {
            this.overviewTable.addRow([
                new CustomLabelElement(undefined, `Revenue`),
                new CustomLabelElement(undefined, `${revenue + (i * 4325 + i * 981) % 100} SEK`),
                new CustomLabelElement(undefined, `${revenue + (i * 2312 + i * 342) % 80} SEK`),
                new CustomLabelElement(undefined, `${revenue + (i * 9324 + i * 432) % 50} SEK`),
                new CustomLabelElement(undefined, `${revenue + (i * 923  + i * 21 ) % 120} SEK`),
    
            ]);
        }
    }

}



export const stockLayer = new StockLayer();