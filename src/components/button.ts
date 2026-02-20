import { utils } from "../utils";
import { CustomElementInterface } from "./base";



export class CustomButtonElement implements CustomElementInterface { 
    container: HTMLButtonElement;
    icon: HTMLImageElement | undefined;
    label: HTMLDivElement | undefined;
    constructor(parent: HTMLElement, name: string | undefined = undefined, icon: string | undefined = undefined, classNames: Array<string> = []) {
        this.container = utils.createElement("button", parent, ["customButtonElement", ... classNames] );
        if  (icon) {
            this.icon = utils.createElement("img", this.container, ["icon"]);
            this.icon.src = icon;
            this.container.classList.add("hasIcon");
        }

        if (name) {
            this.label = utils.createElement("div", this.container, ["label"]);
            this.label.innerText = name;
            this.container.classList.add("hasText");

        }

    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("Could not add", node);
    }
}