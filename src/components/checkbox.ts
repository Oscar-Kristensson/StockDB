import { CustomElementInterface } from "./base.ts";
import * as utils from "../utils";

enum CheckboxState {
    unchecked = 0,
    checked = 1,
}

export class CustomCheckboxElement implements CustomElementInterface {
    container: HTMLDivElement;
    boxContainer: HTMLDivElement;
    checkMark: HTMLImageElement;
    label: HTMLDivElement;
    state: CheckboxState;
    events: utils.EventSystem | undefined;

    constructor(
        parent: HTMLElement | undefined,
        name: string,
        initialValue: boolean = false,
        events: boolean = false
    ) {
        this.state = initialValue ? CheckboxState.checked : CheckboxState.unchecked;
        
        // Base container setup
        this.container = utils.createElement("div", parent, ["customCheckboxElement"]);
        
        // Checkbox box & visual indicator
        this.boxContainer = utils.createElement("div", this.container, ["checkboxBox"]);
        this.checkMark = utils.createElement("img", this.boxContainer, ["checkMark"]);
        this.checkMark.src = "icons/check.svg";

        // Label setup
        this.label = utils.createElement("div", this.container, ["label"]);
        this.label.innerText = name;

        // Apply initial visual state
        if (this.state === CheckboxState.checked) {
            this.container.classList.add("checked");
        }

        // Setup event bus if requested
        if (events) {
            this.events = new utils.EventSystem();
        }

        // Toggle state on click
        this.container.addEventListener("click", () => {
            this.toggle();
        });
    }

    /**
     * Toggles the current checked/unchecked state
     */
    toggle() {
        if (this.state === CheckboxState.checked) {
            this.setChecked(false);
        } else {
            this.setChecked(true);
        }
    }

    /**
     * Explicitly sets the state of the checkbox
     * * @param isChecked 
     */
    setChecked(isChecked: boolean) {
        if (isChecked && this.state !== CheckboxState.checked) {
            this.state = CheckboxState.checked;
            this.container.classList.add("checked");
            this.events?.post("change");
        } else if (!isChecked && this.state !== CheckboxState.unchecked) {
            this.state = CheckboxState.unchecked;
            this.container.classList.remove("checked");
            this.events?.post("change");
        }
    }

    /**
     * Gets the boolean value of the checkbox
     */
    get value(): boolean {
        return this.state === CheckboxState.checked;
    }

    /**
     * Sets the boolean value of the checkbox
     */
    set value(val: boolean) {
        this.setChecked(val);
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("Can not append", node, "to", this);
    }
}