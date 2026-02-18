import { CustomElementInterface } from "./base";
import { CustomInputElement } from "./input";



export class CustomFormElement implements CustomElementInterface { 
        container: HTMLDivElement;
        inputElementContainer: HTMLDivElement;
        inputs: Array<CustomInputElement>;
        
        constructor(parent: HTMLElement) {
            this.container = document.createElement("div");
            this.container.className = "customFormElement";
            this.inputElementContainer = document.createElement("div");
            this.inputElementContainer.className = "inputElementContainer";
            this.container.appendChild(this.inputElementContainer);

            this.inputs = [];

            parent.appendChild(this.container);

        }

        addInput(input: CustomInputElement) {
            this.inputElementContainer.appendChild(input.getTopMostHTMLContainer());
            this.inputs.push(input);
        }

        getTopMostHTMLContainer(): HTMLElement {
            return this.container;
        }


        appendChild(node: CustomElementInterface | HTMLElement): void {
            console.log("APCHILD", node);
            return;
        }



}