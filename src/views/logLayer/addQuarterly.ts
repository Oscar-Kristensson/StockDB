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

    if (quarter > 4 || quarter < 0) {
        return new InputValidationError(
            InputValidationStates.error,
            "Quarter must between 0 and 4 (Q0 for yearly)"
        )
    }


    return InputValidationStates.ok;

}





export class AddRecordForm extends CustomFormElement {
    year_input: CustomInputElement;
    quarter_input: CustomInputElement;
    stock_selector: CustomDropdownElement;
    revenue_input: CustomInputElement;
    gross_profit_input: CustomInputElement;
    operating_income_input: CustomInputElement;
    net_income_input: CustomInputElement;
    shares_outstanding_input: CustomInputElement;
    total_shareholders_equity_input: CustomInputElement;
    share_price_input: CustomInputElement;
    dividend_input: CustomInputElement;


    // OLD
    infoPanel: HTMLDivElement;
    inputError: CustomErrorMessage;


    constructor(parent: HTMLElement) {
        super(parent);

        this.infoPanel = utils.createElement("div", this.container, ["infoPanel"]);

        this.onInput = this.onInput.bind(this);


        this.year_input = new CustomInputElement(undefined, "Year", undefined, "number", false, validateYear);
        this.year_input.value = String(new Date().getFullYear());
        this.addInput(this.year_input);
        
        this.quarter_input = new CustomInputElement(undefined, "Quarter (1-4, 0 yearly)", undefined, "number", false, validateQuarter);
        this.quarter_input.placeholder = "1";
        this.addInput(this.quarter_input);
        
        this.stock_selector = new CustomDropdownElement(undefined, "Stock", [], true);
        this.addInput(this.stock_selector);
        this.stock_selector.events?.listen("close", this.onInput);
        

        
        
        this.revenue_input = new CustomInputElement(undefined, "Revenue (Omsättning)", "SEK", "number", false);
        this.revenue_input.placeholder = "1 000 000";
        this.addInput(this.revenue_input);
        
        
        this.gross_profit_input = new CustomInputElement(undefined, "Gross profit (Bruttoresultat)", "SEK", "number", false);
        this.gross_profit_input.placeholder = "1 000 000";
        this.addInput(this.gross_profit_input);

        
        
        
        
        this.operating_income_input = new CustomInputElement(undefined, "Operating income (Rörelseresultat)", "SEK", "number", false);
        this.operating_income_input.placeholder = "1 000 000";
        this.addInput(this.operating_income_input);
        
        
        this.net_income_input = new CustomInputElement(undefined, "Net income (Nettoresultat)", "SEK", "number", false);
        this.net_income_input.placeholder = "1 000 000";
        this.addInput(this.net_income_input);
        
        
        this.shares_outstanding_input = new CustomInputElement(undefined, "Shares outstanding (Antal aktier)", "SEK", "number", false);
        this.shares_outstanding_input.placeholder = "1 000 000";
        this.addInput(this.shares_outstanding_input);
        
        this.total_shareholders_equity_input = new CustomInputElement(undefined, "Total equity (Eget kapital)", "%", "number", false);
        this.total_shareholders_equity_input.placeholder = "1 000 000";
        this.addInput(this.total_shareholders_equity_input);
        
        this.share_price_input = new CustomInputElement(undefined, "Share price (Aktiekurs)", "%", "number", false);
        this.share_price_input.placeholder = "1 000 000";
        this.addInput(this.share_price_input);
        
        this.dividend_input = new CustomInputElement(undefined, "Dividend (Utdelning)", "%", "number", false);
        this.dividend_input.placeholder = "1 000 000";
        this.addInput(this.dividend_input);

        


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
                this.stock_selector.addItem(new DropDownItem(item.name, item.id))
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

        if (!(typeof this.stock_selector.value === "number")) {
            return;

        }

console.log([
            this.stock_selector.value,
            Number(this.year_input.value),
            Number(this.quarter_input.value),
            Number(this.revenue_input.value),
            Number(this.gross_profit_input.value),
            Number(this.operating_income_input.value),
            Number(this.net_income_input.value),
            Number(this.shares_outstanding_input.value),
            Number(this.total_shareholders_equity_input.value),
            Number(this.share_price_input.value),
            Number(this.dividend_input.value),

]);


        db.addQuarterly(
            this.stock_selector.value,
            Number(this.year_input.value),
            Number(this.quarter_input.value),
            Number(this.revenue_input.value),
            Number(this.gross_profit_input.value),
            Number(this.operating_income_input.value),
            Number(this.net_income_input.value),
            Number(this.shares_outstanding_input.value),
            Number(this.total_shareholders_equity_input.value),
            Number(this.share_price_input.value),
            Number(this.dividend_input.value),
        );



        [
            this.year_input,
            this.quarter_input,
            this.stock_selector,
            this.revenue_input,
            this.gross_profit_input,
            this.operating_income_input,
            this.net_income_input,
            this.shares_outstanding_input,
            this.total_shareholders_equity_input,
            this.share_price_input,
            this.dividend_input,
        ]
        .forEach(input => {
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

        if (this.stock_selector.value === undefined) {
            if (throwError)
                this.inputError.throw("Invalid stock", "A stock must be selected");
            return false;
        }

        if (this.year_input.value === undefined || validateYear(this.year_input.value) !== InputValidationStates.ok) {
            if (throwError)
                this.inputError.throw("Invalid year", "A valid year must be inputted");
            return false;
        }

        if (this.quarter_input.value === undefined || validateQuarter(this.quarter_input.value) !== InputValidationStates.ok) {
            if (throwError)
                this.inputError.throw("Invalid quarter_input", "A quarter must be inputted");
            return false;
        }

        


        return true;
    }
}
