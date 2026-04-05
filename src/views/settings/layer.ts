import { AppLayer } from "../../appLayer.ts";
import { StockDB } from "../../app.ts";
import { CustomHeading } from "../../components/heading.ts";
import * as utils from "../../utils"
import { os } from "../../os.ts";
import { CustomContainer } from "../../components/container.ts";
import { ExportOptions } from "./exportOptions.ts";

class SettingsLayer extends AppLayer {
    app: StockDB | undefined;
    container: HTMLDivElement | undefined;
    exportOptions: ExportOptions | undefined;


    constructor() {
        super("Settings", "icons/StockIcon.svg");

    }
    
    createUI() {
        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }

        this.container = utils.createElement("div", this.layerContainer, ["setttingsLayer"]);
        this.container.className = "settingsLayer";

        new CustomHeading(this.container, "Settings", "info", 2);


        const linksContainer = new CustomContainer(this.container, "Links");

        this.exportOptions = new ExportOptions(this.container);
        

        const text = new utils.SmartVar<string>("");
        text.events.listen("updated", () => {
            console.log(">>", text);
            linksContainer.getTopMostHTMLContainer().innerText = text.value;

        })

        
        os.getDataDir()
        .then(result => {
            console.log(result, typeof result);
            if (typeof result === "string"){
                text.value += "\nData dir: " + result;

            }
        })

        os.getcwd()
        .then(result => {
            if (typeof result === "string")
                text.value += "\nWorking dir: " + result;
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