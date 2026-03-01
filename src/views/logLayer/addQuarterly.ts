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

function validateQuarter(quarterString: string) {
    if (quarterString === "") {
        return InputValidationStates.empty;
    }

    const quarter = Number(quarterString);

    if (isNaN(Number(quarter))) {
        return new InputValidationError(
            InputValidationStates.error,
            "Quarter must be a number"
        )
    }

    if (quarter > 4 || quarter < 1) {
        return new InputValidationError(
            InputValidationStates.error,
            "Quarter must between 1 and 4"
        )
    }


    return InputValidationStates.ok;

}





export class AddRecordForm extends CustomFormElement {
    yearInput: CustomInputElement;
    quarterInput: CustomInputElement;
    stockSelector: CustomDropdownElement;
    revenueInput: CustomInputElement;
    grossProfitInput: CustomInputElement;
    operatingIncomeInput: CustomInputElement;
    netIncomeInput: CustomInputElement;
    sharesOutstandingInput: CustomInputElement;
    infoPanel: HTMLDivElement;
    inputError: CustomErrorMessage;


    constructor(parent: HTMLElement) {
        super(parent);

        this.infoPanel = utils.createElement("div", this.container, ["infoPanel"]);

        this.onInput = this.onInput.bind(this);


        this.yearInput = new CustomInputElement(undefined, "Year", undefined, "number", false, validateYear);
        this.yearInput.value = String(new Date().getFullYear());
        this.addInput(this.yearInput);
        
        this.quarterInput = new CustomInputElement(undefined, "Quarter (1-4)", undefined, "number", false, validateQuarter);
        this.quarterInput.placeholder = "1";
        this.addInput(this.quarterInput);
        
        this.stockSelector = new CustomDropdownElement(undefined, "Stock", [], true);
        this.addInput(this.stockSelector);
        this.stockSelector.eventSystem?.listen("close", this.onInput);
        

        
        
        this.revenueInput = new CustomInputElement(undefined, "Quarter (1-4)", "SEK", "number", false);
        this.revenueInput.placeholder = "1 000 000";
        this.addInput(this.revenueInput);
        
        this.grossProfitInput = new CustomInputElement(undefined, "Gross profit", "SEK", "number", false);
        this.grossProfitInput.placeholder = "1 000 000";
        this.addInput(this.grossProfitInput);
        
        this.operatingIncomeInput = new CustomInputElement(undefined, "Operating income", "SEK", "number", false);
        this.operatingIncomeInput.placeholder = "1 000 000";
        this.addInput(this.operatingIncomeInput);
        
        this.netIncomeInput = new CustomInputElement(undefined, "Net income", "SEK", "number", false);
        this.netIncomeInput.placeholder = "1 000 000";
        this.addInput(this.netIncomeInput);
        
        this.sharesOutstandingInput = new CustomInputElement(undefined, "Shares outstanding", "SEK", "number", false);
        this.sharesOutstandingInput.placeholder = "1 000 000";
        this.addInput(this.sharesOutstandingInput);
        

        this.send = this.send.bind(this);

        new CustomButtonElement(this.infoPanel, "Add record", "icons/addStockIcon.svg", [], this.send);

        // NOTE: This should reload each time the user visits the page
        // NOTE: Or more likely everytime the stocks change (a stock is added etc)
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



        this.container.addEventListener("keydown", this.onInput);





    }

    override send() {
        console.log("Send add record!");
        const isValid = this.validate(true);

        if (isValid) {
            this.inputError.hide();
        }

        [this.revenueInput, this.grossProfitInput, this.netIncomeInput, this.operatingIncomeInput, this.sharesOutstandingInput].forEach(input => {
            input.value = "";
        })



        this.container.classList.add("invalid");




        return;


        

    }

    onInput() {
        const valid = this.validate();
        if (valid) {
            this.container.classList.remove("invalid");
        } else {
            this.container.classList.add("invalid");
        }
    }



    validate(throwError: boolean = false): boolean {
        throwError;

        console.log(this.stockSelector.value);

        if (this.stockSelector.value === undefined) {
            if (throwError)
                this.inputError.throw("Invalid stock", "A stock must be selected");
            return false;
        }

        if (this.yearInput.value === undefined || validateYear(this.yearInput.value) !== InputValidationStates.ok) {
            if (throwError)
                this.inputError.throw("Invalid year", "A valid year must be inputted");
            return false;
        }

        if (this.quarterInput.value === undefined || validateQuarter(this.quarterInput.value) !== InputValidationStates.ok) {
            if (throwError)
                this.inputError.throw("Invalid quarterInput", "A quarter must be inputted");
            return false;
        }

        


        return true;
    }
}
