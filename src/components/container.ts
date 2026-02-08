import { CustomElementInterface } from "./base.ts";



export class CustomContainer implements CustomElementInterface {
    mainContainer: HTMLDivElement;
    contentContainer: HTMLDivElement;
    heading : HTMLHeadingElement;

    constructor(parent: HTMLElement | undefined, heading:string, className: string) {
        this.mainContainer = document.createElement("div");
        this.mainContainer.className = "customContainer";
        this.mainContainer.classList.add(className);

        this.heading = document.createElement("div");
        this.heading.className = "containerHeading";
        this.mainContainer.appendChild(this.heading);
        this.setHeading(heading);

        this.contentContainer = document.createElement("div");
        this.contentContainer.className = "content";
        this.mainContainer.appendChild(this.contentContainer);
        

        parent?.appendChild(this.mainContainer);
    }

    setHeading(heading: string) {
        this.heading.innerText = heading;
    }

    appendChild(node: HTMLElement) {
        this.contentContainer.appendChild(node);
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.mainContainer;
    }
}