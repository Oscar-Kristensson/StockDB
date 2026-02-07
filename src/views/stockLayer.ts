import { AppLayer } from "../appLayer.ts";
import { loadCSS } from "../utils.ts";
import { createContainer } from "../components/base.ts"
import { CustomContainer } from "../components/container.ts";
import { CustomHeading } from "../components/heading.ts";

class StockLayer extends AppLayer {
    container: HTMLElement | undefined;
    graphContainer: CustomContainer | undefined;
    overviewContainer: CustomContainer | undefined;
    informationContainer: CustomContainer | undefined;
    heading: CustomHeading | undefined;

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



        

        

    }

    override onLoad(): HTMLElement | undefined {
        this.createUI();

        return this.container;
    }

    setStockName(stockName: string) {
        this.stockName = stockName;

        this.heading?.setHeading(this.stockName);

    }

}



export const stockLayer = new StockLayer("Unkown Stock");