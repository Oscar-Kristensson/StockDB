
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
    layers: Array<{
        layer: AppLayer, 
        button: LayerButton, 
    }>;

    constructor(navContainer: HTMLElement) {
        this.navContainer = navContainer;
        this.layers = [];

    }

    addLayer(layer: AppLayer) {
        const button = new LayerButton(this, layer.iconPath, layer.name);
        button.deselect();


        this.layers.push({
            layer: layer,
            button: button
        });               
    }
}





export class AppLayer {
    name: string;
    iconPath: string;

    
    constructor(name: string, iconPath: string) {
        this.name = name;
        this.iconPath = iconPath;
    }
}