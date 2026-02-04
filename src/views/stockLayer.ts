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

    }

    override onLoad(): void {
        this.createUI();
        if (!this.container || !this.layerContainer){
            // Note: Add error message
            return;
        }

        this.layerContainer.appendChild(this.container);
    }

}



export const stockLayer = new StockLayer();