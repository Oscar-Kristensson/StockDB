import { CustomElementInterface } from "./base.ts";
import * as utils from "../utils"


export class CustomParagraph implements CustomElementInterface { 
    paragraph: HTMLParagraphElement;
    constructor(container: HTMLElement, content: string) {
        this.paragraph = utils.createElement("p", container, ["customParagraph"]);

        this.paragraph.innerText = content;

    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("Paragraphs do not support children", node);
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.paragraph;
    }

}