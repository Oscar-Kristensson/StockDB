import { CustomFormElement } from "../../components/form.ts";
import { CustomDropdownElement, DropDownItem } from "../../components/dropdown.ts";
import * as utils from "../../utils";
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
    returnOnEquityInput: CustomInputElement;
    pricePerEquityInput: CustomInputElement;
    equityPerShareInput: CustomInputElement;
    earningsPerShareInput: CustomInputElement;
    sharePriceInput: CustomInputElement;
    dividendInput: CustomInputElement;


    // OLD
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
        this.stockSelector.events?.listen("close", this.onInput);
        

        
        
        this.returnOnEquityInput = new CustomInputElement(undefined, "Return on equity", "SEK", "number", false);
        this.returnOnEquityInput.placeholder = "1 000 000";
        this.addInput(this.returnOnEquityInput);
        
        
        this.pricePerEquityInput = new CustomInputElement(undefined, "Price per equity", "SEK", "number", false);
        this.pricePerEquityInput.placeholder = "1 000 000";
        this.addInput(this.pricePerEquityInput);

        
        
        
        
        this.equityPerShareInput = new CustomInputElement(undefined, "Equity per share", "SEK", "number", false);
        this.equityPerShareInput.placeholder = "1 000 000";
        this.addInput(this.equityPerShareInput);
        
        
        this.earningsPerShareInput = new CustomInputElement(undefined, "Earnings per share", "SEK", "number", false);
        this.earningsPerShareInput.placeholder = "1 000 000";
        this.addInput(this.earningsPerShareInput);
        
        
        this.sharePriceInput = new CustomInputElement(undefined, "Share price", "SEK", "number", false);
        this.sharePriceInput.placeholder = "1 000 000";
        this.addInput(this.sharePriceInput);
        
        this.dividendInput = new CustomInputElement(undefined, "Dividend", "%", "number", false);
        this.dividendInput.placeholder = "1 000 000";
        this.addInput(this.dividendInput);

        


        // OLD
        

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
                this.stockSelector.addItem(new DropDownItem(item.name, item.id))
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

        if (!(typeof this.stockSelector.value === "number")) {
            return;

        }




        db.addQuarterly(
            this.stockSelector.value, 
            Number(this.yearInput.value), 
            Number(this.quarterInput.value),
            Number(this.returnOnEquityInput.value),
            Number(this.pricePerEquityInput.value),
            Number(this.equityPerShareInput.value),
            Number(this.earningsPerShareInput.value),
            Number(this.sharePriceInput.value),
            Number(this.dividendInput.value),
        );



        [this.returnOnEquityInput, this.pricePerEquityInput, this.equityPerShareInput, this.earningsPerShareInput, this.sharePriceInput, this.dividendInput].forEach(input => {
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
