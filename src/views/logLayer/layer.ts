import { AppLayer } from "../../appLayer.ts";
import { StockDB } from "../../app.ts";
import { CustomTabs, CustomTab } from "../../components/tabs.ts";

import { CustomHeading } from "../../components/heading.ts";




import { AddStockForm } from "./addStock.ts";
import { AddRecordForm } from "./addQuarterly.ts";





class LogLayer extends AppLayer {
    app: StockDB | undefined;
    container: HTMLDivElement | undefined;
    tabs: CustomTabs | undefined;
    addStockContainer: HTMLDivElement | undefined;
    addRecordContainer: HTMLDivElement | undefined;
    stockForm: AddStockForm | undefined;
    recordForm: AddRecordForm | undefined;

    constructor() {
        super("Log", "icons/LogIcon.svg");
    }


    createUI() {
        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }

        this.container = document.createElement("div");
        this.container.className = "logLayer";


        this.addStockContainer = document.createElement("div");
        this.addStockContainer.className = "tabContainer";
        this.addStockContainer.classList.add("stock");
        new CustomHeading(this.addStockContainer, "Information", "info", 2);
        
        this.addRecordContainer = document.createElement("div");
        this.addRecordContainer.className = "tabContainer";
        this.addRecordContainer.innerText = "record";
        this.addStockContainer.classList.add("stock");
        new CustomHeading(this.addRecordContainer, "Information", "info", 2);



        // NOTE: This is temporary testing code for the CustomInputElement

        this.stockForm = new AddStockForm(this.addStockContainer);
        this.stockForm.events.listen("added", () => {
            this.app?.updateStockList();
        })
        this.recordForm = new AddRecordForm(this.addRecordContainer);


        

        


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