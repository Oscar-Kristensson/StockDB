import { CustomElementInterface } from "./base";
import { CustomDropdownElement } from "./dropdown";
import { CustomInputElement } from "./input";



export class CustomFormElement implements CustomElementInterface { 
        container: HTMLDivElement;
        inputElementContainer: HTMLDivElement;
        inputs: Array<CustomInputElement | CustomDropdownElement>;
        
        constructor(parent: HTMLElement) {
            this.container = document.createElement("div");
            this.container.className = "customFormElement";
            this.inputElementContainer = document.createElement("div");
            this.inputElementContainer.className = "inputElementContainer";
            this.container.appendChild(this.inputElementContainer);

            this.inputs = [];

            parent.appendChild(this.container);

        }



        send() {
            console.log("Send. This function should be overriden if it is called");
        }

        validate() {
            return true;
        }

        addInput(input: CustomInputElement | CustomDropdownElement) {
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