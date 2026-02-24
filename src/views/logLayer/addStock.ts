import { CustomInputElement, InputValidationError, InputValidationStates } from "../../components/input.ts";
import { CustomFormElement } from "../../components/form.ts";
import { isStockSector, StockInfo, StockSectors } from "../../db/stocks.ts";
import * as db from "../../db"
import { CustomDropdownElement, DropDownItem } from "../../components/dropdown.ts";
import * as utils from "../../utils.ts";
import { CustomButtonElement } from "../../components/button.ts";
import { CustomErrorMessage } from "../../components/errorMsg.ts";

function validateTicker(ticker: string) {
    ticker = ticker.toUpperCase();
    if (ticker === "")
        return InputValidationStates.empty;

    if (ticker.length > 12) {
        return new InputValidationError(
            InputValidationStates.error,
            "The ticker was to long",
        );
    }

    if (!/^[-A-Z]+$/.test(ticker)) {
        return new InputValidationError(
            InputValidationStates.error,
            `${ticker} is invalid. The ticker may only contain letters and "-".`
        );
        
    }

    
    return InputValidationStates.ok;
}

function validateName(name: string) {
    if (name === "")
        return InputValidationStates.empty;

    if (!/^[a-zA-Z ]+$/.test(name)) {
        return new InputValidationError(
            InputValidationStates.error,
            `${name} is invalid. The name may only contain letters and spaces.`
        )
    }

    return InputValidationStates.ok;

}



export class AddStockForm extends CustomFormElement {
    ticker: CustomInputElement;
    name: CustomInputElement;
    exchange: CustomInputElement;
    sector: CustomDropdownElement;
    industry: CustomInputElement;
    infoPanel: HTMLDivElement;
    inputError: CustomErrorMessage;


    constructor(parent: HTMLElement) {
        super(parent);

        this.infoPanel = utils.createElement("div", this.container, ["infoPanel"]);

        this.ticker = new CustomInputElement(undefined, "Ticker", "", "text", true, validateTicker);
        this.ticker.placeholder = "ex INVE-B";
        this.addInput(this.ticker);
        
        this.ticker.eventSystem?.listen("input", () => {
            this.ticker.value = this.ticker.value.toUpperCase();
        })
        


        this.name = new CustomInputElement(undefined, "Name", "", "text", true, validateName);
        this.name.placeholder = "Investor-B";
        this.addInput(this.name);

        this.exchange = new CustomInputElement(undefined, "Exchange", "", "text", true);
        this.exchange.placeholder = "Nasdaq Stockholm";
        this.addInput(this.exchange);

        // NOTE: This should be a drop down element
        const options = [];
        for (const [sector, key] of Object.entries(StockSectors)) {
            options.push(new DropDownItem(utils.pascalToWords(sector), key));
        }
        
        this.sector = new CustomDropdownElement(undefined, "Sector", options);
        this.addInput(this.sector);

        this.industry = new CustomInputElement(undefined, "Industry", "", "text", true);
        this.industry.placeholder = "Investment Companies";
        this.addInput(this.industry);

        this.industry.input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.send();
            }
        });

        this.send = this.send.bind(this);

        new CustomButtonElement(this.infoPanel, "Add stock", "icons/addStockIcon.svg", [], this.send);

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
        console.log("Send add stock!");

        if (!this.validate()) {
            return;
        }



        if (!this.sector.currentOption) {
            this.inputError.throw(
                "Sector not selected", 
                "A stock must have a sector selected"
            )
            return;
        }
        if (!this.sector.currentOption.value) {
            this.inputError.throw(
                "Sector value not accessible", 
                "Could not access the sector value since it was undefined"
            )
            return;
        }
        if (typeof this.sector.currentOption.value !== "string") {
            this.inputError.throw(
                "Sector value unvalid", 
                "The sector value was not a string"
            )
            return;
        }

        if (!isStockSector(this.sector.currentOption.value)) {
            return;
        }



        const stock = new StockInfo(0, this.ticker.value, this.name.value, 
            this.exchange.value, this.sector.currentOption.value, this.industry.value, "SEK"
        )

        db.addStock(stock);
        

    }



    validate(throwError: boolean = false): boolean {
        if (this.name.inputState !== InputValidationStates.ok) {
            if (throwError)
                this.inputError.throw("Invalid name", "The name was not valid!");
            return false;
        }

        if (this.ticker.inputState !== InputValidationStates.ok) {
            if (throwError)
                this.inputError.throw("Invalid ticker", "The ticker was not valid!");
            return false;
        }

        if (this.exchange.inputState !== InputValidationStates.ok) {
            if (throwError)
                this.inputError.throw("Invalid exchange", "The exchange was not valid!");
            return false;
        }

        if (this.industry.inputState !== InputValidationStates.ok) {
            if (throwError)
                this.inputError.throw("Invalid industry", "The industry was not valid!");

            return false;
        }





        if (!validateName(this.name.value)) {
            if (throwError)
                this.inputError.throw("Invalid name", "The name was not valid!");
            
            return false;
        }

        this.inputError.hide();

        return true;
    }
}
