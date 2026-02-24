import * as utils from "../utils.ts";
import { CustomElementInterface } from "./base";



export class CustomErrorMessage implements CustomElementInterface { 
    container: HTMLDivElement;
    icon: HTMLImageElement;
    message: HTMLDivElement;
    heading: HTMLDivElement;
    constructor(parent: HTMLElement, classNames: Array<string> = []) {
        this.container = utils.createElement("div", parent, ["customErrorMessage", "hidden", ... classNames] );

        this.icon = utils.createElement("img", this.container, ["icon"]);
        this.icon.src = "icons/errorIcon.svg";
        

        this.message = utils.createElement("div", this.container, ["message"]);


        this.heading = utils.createElement("div", this.container, ["heading"]);

    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("Could not add", node);
    }


    setError(heading: string, message: string) {
        this.heading.innerText = heading;
        this.message.innerText = message;
    }

    throw(heading: string, message: string) {
        this.setError(heading, message);
        this.show();
    }

    show() {
        this.container.classList.remove("hidden");
    }

    hide() {
        this.container.classList.add("hidden");
    }
}