import { AppLayer } from "../appLayer.ts";
import { StockDB } from "../app.ts";


class LogLayer extends AppLayer {
    app: StockDB | undefined;
    container: HTMLDivElement | undefined;

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

        console.log(this.app, this.layerSwitcher);
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