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

    delete() {
        this.container.remove();
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
    eventSystem: utils.EventSystem | undefined;
    

    constructor(
        parent: HTMLElement | undefined, 
        name: string,
        items: Array<DropDownItem>,
        eventSystem: boolean = false,

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



        this.items = [];

        items.forEach(item => {
            this.addItem(item);
        });

        if (eventSystem) {
            this.eventSystem = new utils.EventSystem();
        }

        


        


    }

    addItem(item: DropDownItem) {
        this.dropdownContainer.appendChild(item.container);
        this.items.push(item);
        item.dropdown = this;
        

    }

    clearItems() {
        this.items.forEach(item => {
            item.delete();
        })
    }

    /**
     * Sets the current option to a DropDownItem
     * 
     * @param item 
     * @param forceUpdate 
     * @param evenIfClosed 
     * @returns 
     */
    updateCurrentOption(item: DropDownItem, forceUpdate: boolean = false, checkIfOpen:boolean = true) {
        if (checkIfOpen && this.state === DropdownState.closed)
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

        if (this.eventSystem) {
            this.eventSystem.post("close");
        }
    }


    getValues() {
        const values: Array<string | number> = [];
        this.items.forEach(item => {
            values.push(item.value);
        })

        return values;
    }


    get value() : number | string | undefined {
        return this.currentOption?.value;
    }

    set value(value: string | number) {
        const values = this.getValues();
        const index = values.indexOf(value)
        if (index === -1) {
            return;
        }

        const newValueItem = this.items[index];
        console.log("newValueItem", newValueItem);
        this.updateCurrentOption(newValueItem, false, false);

    }


    

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("Can not append", node, "to", this);
    }
}