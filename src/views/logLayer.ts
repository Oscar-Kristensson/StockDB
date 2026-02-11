import { AppLayer } from "../appLayer.ts";
import { StockDB } from "../app.ts";
import { CustomTabs, CustomTab } from "../components/tabs.ts";

class LogLayer extends AppLayer {
    app: StockDB | undefined;
    container: HTMLDivElement | undefined;
    tabs: CustomTabs | undefined;

    constructor() {
        super("Log", "icons/StockIcon.svg");
    }


    createUI() {
        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }
        this.container = document.createElement("div");
        this.container.className = "logLayer";


        this.tabs = new CustomTabs(this.container);
        this.tabs.addTab(new CustomTab("Add stock"));
        this.tabs.addTab(new CustomTab("Add record"));
        

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