import { AppLayer } from "../appLayer.ts";




class StockLayer extends AppLayer {
    container: HTMLElement | undefined;
    constructor() {
        super("Stocks", "assets/icons/StockIcon.svg");

    }

    createUI() {
        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }
        this.container = document.createElement("div");
        this.container.className = "stockLayer";
        const test = document.createElement("div");
        test.innerText = "Stocks!";
        this.container.appendChild(test);

    }

    override onLoad(): HTMLElement | undefined {
        this.createUI();

        return this.container;
    }

}



export const stockLayer = new StockLayer();