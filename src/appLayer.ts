class LayerButton {
    button: HTMLButtonElement;
    icon: HTMLImageElement;
    text: HTMLElement;
    linkedLayer: AppLayer;
    layerSwitcher: LayerSwitcher;

    constructor(layerSwitcher:LayerSwitcher, iconPath: string, linkedLayer: AppLayer) {
        this.linkedLayer = linkedLayer;
        this.button = document.createElement("button");
        
        this.icon = document.createElement("img");
        this.icon.src = iconPath;

        this.text = document.createElement("div");
        this.text.textContent = linkedLayer.name;
        this.text.className = "text";

        this.button.appendChild(this.icon);
        this.button.appendChild(this.text);

        this.layerSwitcher = layerSwitcher;

        this.layerSwitcher.navContainer.appendChild(this.button);

        this.button.addEventListener("click", () => { this.exe(); })
    }

    exe() {
        this.layerSwitcher.loadLayer(this.linkedLayer);
    }
    select() { this.button.classList.add("selected"); }
    deselect() { this.button.classList.remove("selected"); }


}

/**
 * Contains the logic for switching between different layers
 */
export class LayerSwitcher {
    navContainer: HTMLElement;
    mainContainer: HTMLElement;
    currentLoadedLayer: AppLayer | undefined;
    layers: Array<AppLayer>;
    buttons: Array<LayerButton>;


    constructor(navContainer: HTMLElement, mainContainer: HTMLElement) {
        this.navContainer = navContainer;
        this.layers = [];
        this.buttons = [];
        this.mainContainer = mainContainer;

    }

    addLayer(layer: AppLayer) {
        const button = new LayerButton(this, layer.iconPath, layer);
        button.deselect();


        this.layers.push(layer);
        this.buttons.push(button);
        
    }

    loadLayer(layer: AppLayer) {
        const newLayerIndex = this.layers.indexOf(layer);

        if (newLayerIndex === -1) {
            console.error("Could not load layer since it could not be found in the switcher");
            return;
        }


        if (this.currentLoadedLayer === layer) {
            return;
        }

        

        if (this.currentLoadedLayer) {
            const previousLayerIndex = this.layers.indexOf(this.currentLoadedLayer);

            this.currentLoadedLayer.unload();
            this.buttons[previousLayerIndex].deselect();

        }

        // Add the links to the switcher for the ability to switch layers etc
        layer.layerSwitcher = this;
        layer.layerContainer = this.mainContainer;
        
        const HTML = layer.onLoad();
        if (HTML)
            this.mainContainer.replaceChildren(HTML);
        else 
            this.mainContainer.replaceChildren();

        this.buttons[newLayerIndex].select();
        
        this.currentLoadedLayer = layer;
    }
}




export class AppLayer {
    name: string;
    iconPath: string;
    layerContainer: HTMLElement | undefined;
    layerSwitcher: LayerSwitcher | undefined;

    
    constructor(name: string, iconPath: string) {
        this.name = name;
        this.iconPath = iconPath;
    }

    /**
     * This function should be overriden
     */
    onLoad(): HTMLElement | undefined {
        console.log("Loaded layer", this.name)
        if (this.layerContainer)
            this.layerContainer.innerText = this.name;

        return undefined;
    }

    unload() {
        
    }
}