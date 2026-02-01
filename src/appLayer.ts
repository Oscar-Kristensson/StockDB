



export class LayerSwitcher {
    navContainer: HTMLElement;
    layers: Array<AppLayer>;

    constructor(navContainer: HTMLElement) {
        this.navContainer = navContainer;
        this.layers = [];

    }

    addLayer(layer: AppLayer) {
        const tempElement = document.createElement("div");
        tempElement.innerText = layer.temp;

        this.navContainer.appendChild(tempElement);
                
    }
}





export class AppLayer {
    temp: string;
    constructor(temp: string) {
        this.temp = temp;
    }
}