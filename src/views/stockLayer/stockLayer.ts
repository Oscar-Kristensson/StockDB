import { AppLayer } from "../../appLayer.ts";
import { CustomContainer } from "../../components/container.ts";
import { CustomTable } from "../../components/table.ts";
import { CustomStockInfo } from "../../components/stockInfo.ts";
import { StockDB } from "../../app.ts";
import { CustomLabelElement, InfoTableRow } from "./customLabel.ts";
import * as utils from "../../utils"
import { QuarterlyReport } from "../../db/quarterly.ts";
import { OverviewTableRow, TableRowStruct, buildOverviewTable, METRIC_ROWS } from "./tables.ts";
import { CustomDropdownElement, DropDownItem } from "../../components/dropdown.ts";
import { renderOverviewTable, CustomTableData } from "../../components/new_table.ts";

import * as economy from "../../economy"

class StockLayer extends AppLayer {
    container: HTMLElement | undefined;
    graphContainer: CustomContainer | undefined;
    overviewContainer: CustomContainer | undefined;
    informationContainer: CustomContainer | undefined;
    derivedInformationContainer: CustomContainer | undefined;
    stockInfo: CustomStockInfo | undefined;
    old_overviewTable: CustomTable | undefined;
    infoTable: CustomTable | undefined;
    derivedInfoTable: CustomTable | undefined;
    

    overviewTable: CustomTableData | undefined;

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
        this.onStockChange = this.onStockChange.bind(this);




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
            console.log("Stock dropdown change!");
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
        this.derivedInformationContainer = new CustomContainer(this.container, "Key values", "derivedInformationContainer");



        this.old_overviewTable = new CustomTable(this.overviewContainer, "overviewTable", 5);
        //this.generateStockOverViewTable();


        this.overviewTable = {
            columns: [
                { key: "latest", label: "Latest" },
                { key: "5y", label: "5 years" },
                { key: "10y", label: "10 years" },
                { key: "all", label: "All" },
            ],
            rows: [
                "Return on equity",
                "Price per equity",
                "Equity per share",
                "Earnings per share",
                "P/e ratio",
                "Shares price",
                "Dividend",
            ].map((label) => ({
                label,
                values: {
                latest: { value: null, loaded: false },
                "5y": { value: null, loaded: false },
                "10y": { value: null, loaded: false },
                all: { value: null, loaded: false },
            },
            })),
        };
        


        this.infoTable = new CustomTable(this.informationContainer, "infoTable", QuarterlyReport.keys.length + 1);
        this.generateInfoTable();
        
        
        this.derivedInfoTable = new CustomTable(this.derivedInformationContainer, "derivedInfoTable", economy.derivedMetricKeys.length + 1);
        this.generateDerivedInfoTable();

        
        if (this.app) {
            this.app.events.listen("stockListUpdate", this.onStockListChange);
            this.app.events.listen("stockChange", this.onStockChange);
        }

        this.onStockListChange();
        

        

    }

    onStockChange() {
        if (!this.app) {
            console.error("App must be registered"); 
            return;
        }





        this.clearStockOverviewTable();
        this.generateStockOverViewTable();






    }

    /**
     * Is called when the stockList in the app is updated
     * 
     * Updates the stock selector dropdown
     * 
     * @returns 
     */
    onStockListChange() {
        console.log("Stock change!");

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
        this.updateInformationOverviewTable();


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

    async updateInformationOverviewTable() {
        if (!this.app) {
            console.log("Test");
            return;
        }

        if (!this.app.stock) {
            console.log("Test");
            return;
        }

        const stock = this.app.stock;

        const quarterlyReports = (await stock.getData())?.filter(r => r.fiscal_quarter === 0).sort((a, b) => 
            utils.calcTotalPeriod(b.fiscal_year, b.fiscal_quarter) - utils.calcTotalPeriod(a.fiscal_year, a.fiscal_quarter));

        if (!quarterlyReports){
            return;
        }

        if (!this.infoTable || !this.derivedInfoTable){
            return;
        }


        
        this.infoTable.clearRows();
        this.derivedInfoTable.clearRows();

        
        quarterlyReports.forEach(report => {
            // Info table
            const it_row: Array<CustomLabelElement> = [
                new CustomLabelElement(undefined, report.getReportTimeStringA())
            ];

            const dit_row: Array<CustomLabelElement> = [
                new CustomLabelElement(undefined, report.getReportTimeStringA())
            ];
            
            report.forEach((key) => {
                let number = report[key];
                let number_str: string;
                if (typeof number === "number") number_str = utils.formatWithPrefix(number);
                else number_str = String(number);

                it_row.push(new CustomLabelElement(undefined, number_str));
            })

            const it_tableRow = new InfoTableRow(it_row);
            this.infoTable?.addRow(it_tableRow);



            // Derived table
            const derived_metrics = economy.computeDerivedMetrics(report);

            METRIC_ROWS.map(({ key }) => {
                let number = derived_metrics[key];
                let number_str: string;
                if (typeof number === "number") number_str = utils.formatWithPrefix(number);
                else number_str = String(number);

                dit_row.push(new CustomLabelElement(undefined, number_str));

            });

            const dit_tableRow = new InfoTableRow(dit_row);
            this.derivedInfoTable?.addRow(dit_tableRow);

        });


        console.log(quarterlyReports)
    }

    async updateStockOverviewTable() {
        this.clearStockOverviewTable();

        if (!this.stock) {
            console.error("Could not update the StockOverviewTable since the stock was not loaded in");
            return;
        }

        if (!this.overviewContainer) {
            console.error("Could not update the StockOverviewTable since the overviewContainer was not loaded in");
            return;
        }




        const summary: economy.StockMetricsSummary = await this.stock.getStatistics("Yearly");
        const tableData = buildOverviewTable(summary);
        const currency = this.stock.info?.currency;
        const html = renderOverviewTable(tableData, "", currency);

        this.overviewContainer.contentContainer.innerHTML = html;
    }

    clearStockOverviewTable() {
        this.returnOnEquity?.data.setData(undefined, undefined, undefined, undefined);
        this.pricePerEquity?.data.setData(undefined, undefined, undefined, undefined);
        this.equityPerShare?.data.setData(undefined, undefined, undefined, undefined);
        this.earningsPerShare?.data.setData(undefined, undefined, undefined, undefined);
        this.sharePrice?.data.setData(undefined, undefined, undefined, undefined);
        this.dividend?.data.setData(undefined, undefined, undefined, undefined);
    }


    


    generateStockOverViewTable() {
        if (!(this.old_overviewTable instanceof CustomTable)) {
            console.error("The overview table is not correctly initalized!");
            return;
        }

        this.old_overviewTable.addRow_L([
            new CustomLabelElement(undefined, ""),
            new CustomLabelElement(undefined, "Latest"),
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




        this.old_overviewTable.addRow(this.returnOnEquity);
        this.old_overviewTable.addRow(this.pricePerEquity);
        this.old_overviewTable.addRow(this.equityPerShare);
        this.old_overviewTable.addRow(this.earningsPerShare);
        this.old_overviewTable.addRow(this.sharePrice);
        this.old_overviewTable.addRow(this.dividend);

        




    }


    generateInfoTable() {
        if (!(this.infoTable instanceof CustomTable)) {
            console.error("The overview table is not correctly initalized!");
            return;
        }


        const row: Array<CustomLabelElement> = [
            new CustomLabelElement(undefined, "Period")
        ];
        QuarterlyReport.keys.forEach(value => {
            row.push(
                new CustomLabelElement(undefined, String(value[1]))
            );
        });


        this.infoTable.addRow_L(row, true);
    }

    generateDerivedInfoTable() {
        if (!(this.derivedInfoTable instanceof CustomTable)) {
            console.error("The derived info table is not correctly initalized!");
            return;
        }



        const row: Array<CustomLabelElement> = [
            new CustomLabelElement(undefined, "Period")
        ];

        METRIC_ROWS.map(({ label }) => {
            row.push(
                new CustomLabelElement(undefined, label.replace("{currency}", ""))
            )
        })


        this.derivedInfoTable.addRow_L(row, true);
    }

}



export const stockLayer = new StockLayer();