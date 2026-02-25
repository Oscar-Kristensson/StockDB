import { CustomFormElement } from "../../components/form.ts";
import { CustomDropdownElement, DropDownItem } from "../../components/dropdown.ts";
import * as utils from "../../utils.ts";
import { CustomButtonElement } from "../../components/button.ts";
import { CustomErrorMessage } from "../../components/errorMsg.ts";
import * as db from "../../db"


export class AddRecordForm extends CustomFormElement {
    stockSelector: CustomDropdownElement;
    infoPanel: HTMLDivElement;
    inputError: CustomErrorMessage;


    constructor(parent: HTMLElement) {
        super(parent);

        this.infoPanel = utils.createElement("div", this.container, ["infoPanel"]);


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
