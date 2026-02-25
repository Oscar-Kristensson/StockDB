import { CustomFormElement } from "../../components/form.ts";
import { CustomDropdownElement, DropDownItem } from "../../components/dropdown.ts";
import * as utils from "../../utils.ts";
import { CustomButtonElement } from "../../components/button.ts";
import { CustomErrorMessage } from "../../components/errorMsg.ts";
import * as db from "../../db"
import { CustomInputElement, InputValidationError, InputValidationStates } from "../../components/input.ts";


function validateYear(yearString: string) {
    if (yearString === "") {
        return InputValidationStates.empty;
    }

    const year = Number(yearString);

    if (isNaN(Number(year))) {
        return new InputValidationError(
            InputValidationStates.error,
            "Year must be a number"
        )
    }

    const now: Date = new Date();
    const currentYear: number = now.getFullYear();

    if (year > currentYear) {
        return new InputValidationError(
            InputValidationStates.error,
            `Year can not be larger than current year ${currentYear}`
        )
    }

    if (year < 1900) {
        return new InputValidationError(
            InputValidationStates.error,
            `This year ${year} is to small`
        )
    }




    return InputValidationStates.ok;
}







export class AddRecordForm extends CustomFormElement {
    yearInput: CustomInputElement;
    quarterInput: CustomInputElement;
    stockSelector: CustomDropdownElement;
    infoPanel: HTMLDivElement;
    inputError: CustomErrorMessage;


    constructor(parent: HTMLElement) {
        super(parent);

        this.infoPanel = utils.createElement("div", this.container, ["infoPanel"]);


        this.yearInput = new CustomInputElement(undefined, "Year", undefined, "number", false, validateYear);
        this.yearInput.value = String(new Date().getFullYear());
        this.addInput(this.yearInput);
        
        this.quarterInput = new CustomInputElement(undefined, "Quarter", undefined, "number", false);
        this.addInput(this.quarterInput);

        this.stockSelector = new CustomDropdownElement(undefined, "Stock", []);
        this.addInput(this.stockSelector);

        

        this.send = this.send.bind(this);

        new CustomButtonElement(this.infoPanel, "Add record", "icons/addStockIcon.svg", [], this.send);

        // NOTE: This should reload each time the user visits the page
        db.getAllStocks()
        .then(stockListItems => {
            if (stockListItems === null) {
                return;
            }

            stockListItems.forEach((item) => {
                // Should the dropdown item instead recieve the id instead of ticker
                this.stockSelector.addItem(new DropDownItem(item.name, item.ticker))
            })
        })
        

        this.container.addEventListener("keydown", () => {
            const valid = this.validate();
            if (valid) {
                this.container.classList.remove("invalid");
            } else {
                this.container.classList.add("invalid");
            }

        })

        this.container.classList.add("invalid");


        this.inputError = new CustomErrorMessage(this.infoPanel);




    }

    override send() {
        console.log("Send add record!");
        return;


        

    }



    validate(throwError: boolean = false): boolean {
        throwError;
        return false;

        return true;
    }
}
