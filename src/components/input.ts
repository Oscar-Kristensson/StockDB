import { EventSystem } from "../utils.ts";
import { CustomElementInterface } from "./base.ts";

export enum InputValidationStates {
    empty = 1,
    error = 2,
    ok = 3,


}


export class InputValidationError {
    constructor(
        public error: InputValidationStates,
        public msg: string | undefined,
    ) {}
}


export class CustomInputElement implements CustomElementInterface { 
    container: HTMLDivElement;
    label: HTMLDivElement;
    input: HTMLInputElement;
    unit: HTMLDivElement | undefined;
    validateFunc: (value: string) => InputValidationStates | InputValidationError;
    eventSystem: EventSystem | undefined;
    validInput: boolean;

    constructor(
        parent: HTMLElement | undefined, 
        name: string, 
        unit: string | undefined = undefined, 
        inputType: string | undefined = undefined, 
        eventSystem: boolean = false,
        validateFunc: (value: string) => InputValidationStates | InputValidationError = (value:string) => { return (value === "") ? InputValidationStates.empty : InputValidationStates.ok; },
    ) {
        // NOTE: Add the error message element
        this.container = document.createElement("div");
        this.container.className = "customInputElement";
        this.validInput = false;

        if (eventSystem) {
            this.eventSystem = new EventSystem();
        }

        this.label = document.createElement("div");
        this.label.className = "label";
        this.label.innerText = name;
        this.container.appendChild(this.label);

        this.input = document.createElement("input");
        this.input.className = "input";
        // this.input.name = name;
        //this.input.placeholder = "..."

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


        parent?.appendChild(this.container);

        this.onInput();

    }

    validateInput() {
        if (!this.validateFunc) {
            this.container.classList.remove("valid");
            this.container.classList.remove("invalid");
            this.validInput = false;
            return;
        } 
        
        const rv = this.validateFunc(this.value);
        let validationState: InputValidationStates;

        if (rv instanceof InputValidationError) {
            validationState = rv.error;
        } else {
            validationState = rv;
        }

        switch (validationState) {
            case InputValidationStates.empty:
                this.container.classList.remove("invalid");
                this.container.classList.remove("valid");
                this.validInput = false;
                break;

            case InputValidationStates.ok:
                this.container.classList.remove("invalid");
                this.container.classList.add("valid");
                this.validInput = true;
                break;

            case InputValidationStates.error:
                this.container.classList.add("invalid");
                this.container.classList.remove("valid");
                this.validInput = false;
                break;

        }
    }

    onInput() {

        this.validateInput();


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

    public get placeholder() : string {
        return this.input.placeholder;
    }

    public set placeholder(placeholder: string) {
        this.input.placeholder = placeholder;

    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.error("Table element can not append a child", node.toString());        
    }
}