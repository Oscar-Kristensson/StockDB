import { CustomElementInterface } from "../../components/base.ts";


export class CustomLabelElement implements CustomElementInterface {
    content: HTMLElement;
    constructor(parent: HTMLElement | undefined, content:string | HTMLElement | CustomElementInterface, className:string = "") {
        this.content = document.createElement("div");
        this.content.className = "labelElement";

        if (className !== "")
            this.content.classList.add(className);

        if (typeof content === "string") {
            this.content.innerText = content;
        }

        parent?.appendChild(this.content);

    }

    appendChild(node: HTMLElement) {
        this.content.appendChild(node);
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.content;
    }
}