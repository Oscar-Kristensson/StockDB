
class LayerButton {
    button: HTMLButtonElement;
    icon: HTMLImageElement;
    text: HTMLElement;

    constructor(layerSwitcher:LayerSwitcher, iconPath: string, text: string) {
        this.button = document.createElement("button");
        
        this.icon = document.createElement("img");
        this.icon.src = iconPath;

        this.text = document.createElement("div");
        this.text.textContent = text;
        this.text.className = "text";

        this.button.appendChild(this.icon);
        this.button.appendChild(this.text);

        layerSwitcher.navContainer.appendChild(this.button);
    }

    select() { this.button.classList.add("select"); }
    deselect() { this.button.classList.remove("select"); }


}


export class LayerSwitcher {
    navContainer: HTMLElement;
    mainContainer: HTMLElement;
    currentLoadedLayer: AppLayer | undefined;
    layers: Array<{
        layer: AppLayer, 
        button: LayerButton, 
    }>;

    constructor(navContainer: HTMLElement, mainContainer: HTMLElement) {
        this.navContainer = navContainer;
        this.layers = [];
        this.mainContainer = mainContainer;

    }

    addLayer(layer: AppLayer) {
        const button = new LayerButton(this, layer.iconPath, layer.name);
        button.deselect();


        this.layers.push({
            layer: layer,
            button: button
        });      
        
    }

    loadLayer(layer: AppLayer) {
        const layerExists = this.layers.some(l => l.layer === layer);

        if (!layerExists) {
            console.error("Could not load layer since it could not be found in the switcher");
            return;
        }


        if (this.currentLoadedLayer === layer) {
            return;
        }

        if (this.currentLoadedLayer) {
            this.currentLoadedLayer.unload();
        }

        // Add the links to the switcher for the ability to switch layers etc
        layer.layerSwitcher = this;
        layer.layerContainer = this.mainContainer;

        const HTML = layer.onLoad();
        if (HTML)
            this.mainContainer.replaceChildren(HTML);
        else 
            this.mainContainer.replaceChildren();
            
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
     * This function should be overriden and is ment
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