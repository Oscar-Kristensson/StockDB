import { AppLayer } from "../appLayer.ts";
import { StockDB } from "../app.ts";
import { CustomTabs, CustomTab } from "../components/tabs.ts";
import { loadCSS } from "../utils.ts";
import { CustomInputElement } from "../components/input.ts";

class LogLayer extends AppLayer {
    app: StockDB | undefined;
    container: HTMLDivElement | undefined;
    tabs: CustomTabs | undefined;
    addStockContainer: HTMLDivElement | undefined;
    addRecordContainer: HTMLDivElement | undefined;

    constructor() {
        super("Log", "icons/StockIcon.svg");
    }


    createUI() {
        loadCSS("src/styles/log.css");
        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }
        this.container = document.createElement("div");
        this.container.className = "logLayer";


        this.addStockContainer = document.createElement("div");
        this.addStockContainer.className = "tabContainer";
        this.addStockContainer.classList.add("stock");
        
        this.addStockContainer.innerText = "stock";
        
        this.addRecordContainer = document.createElement("div");
        this.addRecordContainer.className = "tabContainer";
        this.addRecordContainer.innerText = "record";
        this.addStockContainer.classList.add("stock");


        // NOTE: This is temporary testing code for the CustomInputElement
        new CustomInputElement(this.addStockContainer, "Input name", "kr", "number");
        const testElement = new CustomInputElement(this.addStockContainer, "Input name", "kr", "text", true);

        testElement.eventSystem?.listen("input", () => {
            testElement.value = testElement.value.toUpperCase();
        })


        

        


        this.tabs = new CustomTabs(this.container);
        this.tabs.addTab(new CustomTab("Add stock", this.addStockContainer, "icons/addStockIcon.svg"));
        this.tabs.addTab(new CustomTab("Add record", this.addRecordContainer, "icons/recordIcon.svg"));

        this.container.appendChild(this.addStockContainer)
        this.container.appendChild(this.addRecordContainer);

        

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
    }

    /**
     * Is called when the app layer is switched
     * @returns 
     */
    override onLoad(): HTMLElement | undefined {
        if (!this.app)
            this.receivedApp();

        this.createUI();

        return this.container;
    }
}





export const logLayer = new LogLayer();