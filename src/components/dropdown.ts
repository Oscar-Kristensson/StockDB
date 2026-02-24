import { CustomElementInterface } from "./base.ts";
import * as utils from "../utils.ts";


enum DropdownState {
    open = 0,
    closed = 1,
}

export class DropDownItem {
    container: HTMLDivElement;
    value: string | number;
    name: string;
    dropdown: CustomDropdownElement | undefined;
    constructor(name: string, value: string | number) {
        this.container = utils.createElement("div", undefined, ["item"]);
        this.container.innerText = name;
        this.value = value;
        this.name = name;

        this.onClick = this.onClick.bind(this);
        this.container.addEventListener("click", this.onClick);


    }

    onClick() {
        this.dropdown?.updateCurrentOption(this);

    }
}


export class CustomDropdownElement implements CustomElementInterface {
    container: HTMLDivElement;
    selectedContainer: HTMLDivElement;
    dropdownContainer: HTMLDivElement;
    label: HTMLDivElement;
    selectedOption: HTMLDivElement;
    state: DropdownState;
    items: Array<DropDownItem>;
    currentOption: DropDownItem | undefined;
    

    constructor(
        parent: HTMLElement | undefined, 
        name: string,
        items: Array<DropDownItem>,

    ) {
        this.state = DropdownState.closed;
        this.container = utils.createElement("div", parent, ["customDropdownElement"]);

        this.selectedContainer = utils.createElement("div", this.container, ["inputContainer"]);
        this.dropdownContainer = utils.createElement("div", this.container, ["dropdown"]);

        this.label = utils.createElement("div", this.selectedContainer, ["label"]);
        this.label.innerText = name;
        this.selectedOption = utils.createElement("div", this.selectedContainer, ["selectedOption"]);

        this.selectedContainer.addEventListener("click", () => { 
            switch (this.state) {
                case DropdownState.closed:
                    this.open();
                    break;

                case DropdownState.open:
                    this.close();
                    break;
            }
        })



        this.items = items;
    
        this.items.forEach(item => {
            this.addItem(item);
        });

        


        


    }

    addItem(item: DropDownItem) {
        this.dropdownContainer.appendChild(item.container);
        item.dropdown = this;
        

    }

    updateCurrentOption(item: DropDownItem, forceUpdate: boolean = false) {

        if (this.state === DropdownState.closed)
            return;

        if (forceUpdate && item === this.currentOption) {
            return;
        }

        this.currentOption = item;

        this.selectedOption.innerText = this.currentOption.name;

        this.close();


    }

    

    open() {
        this.state = DropdownState.open;
        this.container.classList.add("open");
    }

    close() {
        this.state = DropdownState.closed;
        this.container.classList.remove("open");
    }


    

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("Can not append", node, "to", this);
    }
}