

import { CustomElementInterface } from "./base.ts";
import * as utils from "../utils"


export class CustomCodeElement implements CustomElementInterface { 
    container: HTMLPreElement;
    constructor(container: HTMLElement, content: string, classNames: Array<string> = []) {
        this.container = utils.createElement("pre", container, ["customCodeElement", ...classNames]);


        this.setContent(content);

    }

    hide() {
        this.container.classList.add("hide");
    }

    show() {
        this.container.classList.remove("hide");
    }
    
    setContent(content: string) {
        this.container.innerText = content;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("Codes do not support children", node);
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

}