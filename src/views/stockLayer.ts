import { AppLayer } from "../appLayer.ts";
import { loadCSS } from "../utils.ts";
import { CustomContainer } from "../components/container.ts";
import { CustomHeading } from "../components/heading.ts";
import { CustomTable, CustomTableElement, CustomTableRow } from "../components/table.ts";
import { CustomElementInterface } from "../components/base.ts";

class CustomLabelElement implements CustomElementInterface {
    content: HTMLElement;
    constructor(parent: HTMLElement | undefined, content:string | HTMLElement | CustomElementInterface, className:string = "") {
        this.content = document.createElement("div");
        this.content.className = "labelElement";

        if (className !== "")
            this.content.classList.add(className);

        if (typeof content === "string") {
            this.content.innerText = content;
        }

        parent?.appendChild(this.content);

    }

    appendChild(node: HTMLElement) {
        this.content.appendChild(node);
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.content;
    }
}



class StockLayer extends AppLayer {
    container: HTMLElement | undefined;
    graphContainer: CustomContainer | undefined;
    overviewContainer: CustomContainer | undefined;
    informationContainer: CustomContainer | undefined;
    heading: CustomHeading | undefined;
    overviewTable: CustomTable | undefined;

    stockName: string;


    constructor(stockName: string) {
        super("Stocks", "assets/icons/StockIcon.svg");

        this.stockName = stockName;

    }

    createUI() {
        loadCSS("src/styles/stockLayer.css");

        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }
        this.container = document.createElement("div");
        this.container.className = "stockLayer";


        this.heading = new CustomHeading(this.container, this.stockName, "stockHeading");

        this.graphContainer = new CustomContainer(this.container, "Graph", "graphContainer")
        this.overviewContainer = new CustomContainer(this.container, "Overview", "overviewContainer");
        this.informationContainer = new CustomContainer(this.container, "Info", "informationContainer");



        this.overviewTable = new CustomTable(this.overviewContainer, "informationTable", 5);

        this.generateStockOverViewTable(120, 0, 0);


        

        

    }

    override onLoad(): HTMLElement | undefined {
        this.createUI();

        return this.container;
    }

    setStockName(stockName: string) {
        this.stockName = stockName;

        this.heading?.setHeading(this.stockName);

    }


    generateStockOverViewTable(
        revenue: number,
        operatingExpenses: number,
        earningsPerShare: number,
    ) {
        console.log("GEN", this.overviewTable);

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

        for (let i = 0; i < 100; i++) {
            this.overviewTable.addRow([
                new CustomLabelElement(undefined, `Revenue`),
                new CustomLabelElement(undefined, `${revenue + (i * 4325 + i * 981) % 100} kr`),
                new CustomLabelElement(undefined, `${revenue + (i * 2312 + i * 342) % 80} kr`),
                new CustomLabelElement(undefined, `${revenue + (i * 9324 + i * 432) % 50} kr`),
                new CustomLabelElement(undefined, `${revenue + (i * 923  + i * 21 ) % 120} kr`),
    
            ]);
        }
    }

}



export const stockLayer = new StockLayer("Unkown Stock");