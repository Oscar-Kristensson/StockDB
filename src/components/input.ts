import { EventSystem } from "../utils.ts";
import { CustomElementInterface } from "./base.ts";

export class CustomInputElement implements CustomElementInterface { 
    container: HTMLDivElement;
    label: HTMLDivElement;
    input: HTMLInputElement;
    unit: HTMLDivElement | undefined;
    validateFunc: (value: string) => boolean;
    eventSystem: EventSystem | undefined;

    constructor(
        parent: HTMLElement, 
        name: string, 
        unit: string | undefined = undefined, 
        inputType: string | undefined = undefined, 
        eventSystem: boolean = false,
        validateFunc: (value: string) => boolean = (value:string) => { return value !== ""; },
    ) {
        this.container = document.createElement("div");
        this.container.className = "customInputElement";

        if (eventSystem) {
            this.eventSystem = new EventSystem();
        }

        this.label = document.createElement("div");
        this.label.className = "label";
        this.label.innerText = name;
        this.container.appendChild(this.label);

        this.input = document.createElement("input");
        this.input.className = "input";
        this.input.name = name;
        this.input.placeholder = "..."

        this.input.addEventListener("input", () => { this.onInput(); });

        this.validateFunc = validateFunc;

        if (inputType) {
            this.input.type = inputType;
        }
        this.container.appendChild(this.input);




        if (unit) {
            this.unit = document.createElement("div");
            this.unit.className = "unit";
            this.container.appendChild(this.unit);
        }


        parent.appendChild(this.container);

        this.onInput();

    }

    onInput() {
        console.log("Input!", this.value);

        if (!this.validateFunc || this.validateFunc(this.value)) {
            this.container.classList.add("valid");
        } else {
            this.container.classList.remove("valid");
        }

        if (this.eventSystem) {
            this.eventSystem.post("input");
        }
    }
    
    public get value() : string {
        return this.input.value;
    }

    public set value(value: string) {
        this.input.value = value;

    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.error("Table element can not append a child", node.toString());        
    }
}