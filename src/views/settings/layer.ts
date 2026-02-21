import { AppLayer } from "../../appLayer.ts";
import { StockDB } from "../../app.ts";
import { CustomHeading } from "../../components/heading.ts";
import { utils } from "../../utils.ts";
import { loadCSS } from "../../utils.ts";
import { os } from "../../os.ts";

class SettingsLayer extends AppLayer {
    app: StockDB | undefined;
    container: HTMLDivElement | undefined;


    constructor() {
        super("Settings", "icons/StockIcon.svg");

    }
    
    createUI() {
        loadCSS("src/styles/settings.css");
        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }

        this.container = utils.createElement("div", this.layerContainer, ["setttingsLayer"]);
        this.container.className = "settingsLayer";

        new CustomHeading(this.container, "Settings", "info", 2);

        
        os.getDataDir()
        .then(result => {
            if (this.container)
                this.container.innerText = `Data dir: ${result}`;
        })
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



export const settingsLayer = new SettingsLayer();