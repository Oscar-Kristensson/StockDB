import { AppLayer } from "../../appLayer.ts";
import { CustomContainer } from "../../components/container.ts";
import { CustomTable } from "../../components/table.ts";
import { CustomStockInfo } from "../../components/stockInfo.ts";
import { StockDB } from "../../app.ts";
import { CustomLabelElement } from "./customLabel.ts";
import * as utils from "../../utils"
import { QuarterlyReport } from "../../db/quarterly.ts";
import { OverviewTableRow, TableRowStruct } from "./tables.ts";
import { CustomDropdownElement, DropDownItem } from "../../components/dropdown.ts";
import * as economy from "../../economy"

class StockLayer extends AppLayer {
    container: HTMLElement | undefined;
    graphContainer: CustomContainer | undefined;
    overviewContainer: CustomContainer | undefined;
    informationContainer: CustomContainer | undefined;
    stockInfo: CustomStockInfo | undefined;
    overviewTable: CustomTable | undefined;

    stock: economy.Stock | undefined;
    app: StockDB | undefined;

    quarterlyRecords?: Array<QuarterlyReport>

    averageRevenue: utils.SmartVar<string>;
    averageRevenueElement: CustomLabelElement;


    returnOnEquity: OverviewTableRow | undefined;
    pricePerEquity: OverviewTableRow | undefined;
    equityPerShare: OverviewTableRow | undefined;
    earningsPerShare: OverviewTableRow | undefined;
    sharePrice: OverviewTableRow | undefined;
    dividend: OverviewTableRow | undefined;
    stockDropDown: CustomDropdownElement | undefined;





    constructor() {
        super("Stocks", "icons/StockIcon.svg");

        this.averageRevenueElement = new CustomLabelElement(undefined, "Unkown");
        
        this.averageRevenue = new utils.SmartVar<string>("Unkown")
        this.averageRevenue.events.listen("update", () => {
            if (this.averageRevenueElement)
                this.averageRevenueElement.content.innerText = this.averageRevenue.value;
        });


        this.onStockListChange = this.onStockListChange.bind(this);




    }

    createUI() {

        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }
        this.container = document.createElement("div");
        this.container.className = "stockLayer";


        this.stockDropDown = new CustomDropdownElement(this.container, "Current stock", [], true);
        this.stockDropDown.events?.listen("change", () => {
            if (!this.stockDropDown?.value) {
                return;                
            }

            const index = Number(this.stockDropDown.value);
            this.app?.setStock(index);

        });

        
        this.stockInfo = new CustomStockInfo(this.container, "stockInfo");

        this.graphContainer = new CustomContainer(this.container, "Graph", "graphContainer")
        this.overviewContainer = new CustomContainer(this.container, "Overview", "overviewContainer");
        this.informationContainer = new CustomContainer(this.container, "Info", "informationContainer");



        this.overviewTable = new CustomTable(this.overviewContainer, "informationTable", 6);

        this.generateStockOverViewTable();

        if (this.app) {
            this.app.events.listen("stockListUpdate", this.onStockListChange);
        }

        this.onStockListChange();
        

        

    }

    /**
     * Is called when the stockList in the app is updated
     * 
     * Updates the stock selector dropdown
     * 
     * @returns 
     */
    onStockListChange() {

        if (!this.app) {
            console.warn("This layer is not bound to a layer");
            return;
        }

        if (!this.app.stockItemList) {
            return;
        }


        if (this.stockDropDown) {
            this.stockDropDown.clearItems();

            this.app.stockItemList.value?.forEach(stockItem => {
                this.stockDropDown?.addItem(new DropDownItem(stockItem.name, stockItem.id));
            })


            if (this.app.stock) {
                const values = this.stockDropDown.getValues()

                // NOTE: Consider removing this since it causes weird behavior
                if (values.length !== 0)
                    this.stockDropDown.value = values[0];
            }
            
        }

        
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


        // Inorder for the StockLayer to auto update the stock if it is changed
        if (this.app) {
            this.app.events.listen("stockChange", () => {
                if (this.app 
                    && this.app.stock 
                    && this.app.currentLoadedLayer === this) {
                    this.setStock(this.app.stock);
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

        if (this.app?.stock) {
            this.setStock(this.app.stock);
        }

        return this.container;
    }

    setStock(stock: economy.Stock) {
        this.stock = stock;
        
        if (!this.stockInfo) {
            console.warn("Could not complete setting the stock because the UI was not yet created, please call onLoad or createUI before setting the stock");
            return;
        }


        this.stock.getInfo()
        .then(stockInfo => {
            this.stockInfo?.setStock(stockInfo);

            if (this.stockDropDown) {
                this.stockDropDown.value = stockInfo.ticker;
            }
        })
        .catch(error => {
            console.error("Handle this error", error);
        })
        

        this.updateStockOverviewTable();

        /*

        db.getQuarterlyFromStockID(this.stock.info.id)
            .then(result => {
                if (result instanceof Array) {
                    console.log("Sorting", result);
                    this.quarterlyRecords = result.sort((a, b) => b.totalPeriod - a.totalPeriod);



                    this.averageRevenue.value = String(utils.averageO(this.quarterlyRecords, (record: QuarterlyReport) => {
                        if (record.revenue === null) {
                            return 0;
                        }
                            
                        return record.revenue;
                    }))

                    this.onQuarterlyRecieved();



                    
                } else {
                    console.warn("Not an array", result);
                }
            })
            .catch(error => {
                console.error("An error occured whilst reading quarterly records", error);
            })*/

        



    }


    generateStockHeading() {
        if (!this.container)
            return;
        this.stockInfo = new CustomStockInfo(this.container, "stockInfo");
    }


    onQuarterlyRecieved() {
        console.log("Recieved quarterly for", this.app?.stock?.info?.ticker);
        this.updateStockOverviewTable();


    }

    async updateStockOverviewTable() {
        this.clearStockOverviewTable();

        const stats = await this.stock?.getStatistics("Yearly")
        if (stats === undefined) return;

        this.returnOnEquity?.data.setDataStockStat(stats.returnOnEquity);
        this.pricePerEquity?.data.setDataStockStat(stats.pricePerEquity);
        this.equityPerShare?.data.setDataStockStat(stats.equityPerShare);
        this.earningsPerShare?.data.setDataStockStat(stats.earningsPerShare);
        this.sharePrice?.data.setDataStockStat(stats.sharePrice);
        this.dividend?.data.setDataStockStat(stats.dividend);

        /*const revenue = calcDataAverages(this.quarterlyRecords, "revenue");
        this.revenueRow?.data.setDataS(revenue);

        const gross_profit = calcDataAverages(this.quarterlyRecords, "gross_profit");
        this.grossProfitRow?.data.setDataS(gross_profit);

        const operating_income = calcDataAverages(this.quarterlyRecords, "operating_income");
        this.operatingIncomeRow?.data.setDataS(operating_income);

        const net_income = calcDataAverages(this.quarterlyRecords, "net_income");
        this.netIncomeRow?.data.setDataS(net_income);

        const shares_outstanding = calcDataAverages(this.quarterlyRecords, "shares_outstanding");
        this.sharesOutstandingRow?.data.setDataS(shares_outstanding);*/
    }

    clearStockOverviewTable() {
        this.returnOnEquity?.data.setData(undefined, undefined, undefined, undefined, undefined);
        this.pricePerEquity?.data.setData(undefined, undefined, undefined, undefined, undefined);
        this.equityPerShare?.data.setData(undefined, undefined, undefined, undefined, undefined);
        this.earningsPerShare?.data.setData(undefined, undefined, undefined, undefined, undefined);
        this.sharePrice?.data.setData(undefined, undefined, undefined, undefined, undefined);
        this.dividend?.data.setData(undefined, undefined, undefined, undefined, undefined);
    }


    


    generateStockOverViewTable() {
        if (!(this.overviewTable instanceof CustomTable)) {
            console.error("The overview table is not correctly initalized!");
            return;
        }

        this.overviewTable.addRow_L([
            new CustomLabelElement(undefined, ""),
            new CustomLabelElement(undefined, "Latest"),
            new CustomLabelElement(undefined, "1 year"),
            new CustomLabelElement(undefined, "5 years"),
            new CustomLabelElement(undefined, "10 years"),
            new CustomLabelElement(undefined, "All"),
        ], true);      
        


        
        this.returnOnEquity = new OverviewTableRow(
            new TableRowStruct("Return on equity"),
        )

        this.pricePerEquity = new OverviewTableRow(
            new TableRowStruct("Price per equity"),
        )

        this.equityPerShare = new OverviewTableRow(
            new TableRowStruct("Equity per share"),
        )

        this.earningsPerShare = new OverviewTableRow(
            new TableRowStruct("Earnings per share"),
        )

        this.sharePrice = new OverviewTableRow(
            new TableRowStruct("Shares price"),
        )

        this.dividend = new OverviewTableRow(
            new TableRowStruct("Dividend"),
        )




        this.overviewTable.addRow(this.returnOnEquity);
        this.overviewTable.addRow(this.pricePerEquity);
        this.overviewTable.addRow(this.equityPerShare);
        this.overviewTable.addRow(this.earningsPerShare);
        this.overviewTable.addRow(this.sharePrice);
        this.overviewTable.addRow(this.dividend);

        




    }

}



export const stockLayer = new StockLayer();