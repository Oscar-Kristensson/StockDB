import { CustomButtonElement } from "../../components/button";
import { CustomContainer } from "../../components/container";
import { CustomHeading } from "../../components/heading";
import { CustomParagraph } from "../../components/paragraph";
import * as utils from "../../utils"
import * as db from "../../db"
import { CustomDropdownElement, DropDownItem } from "../../components/dropdown";
import { CustomCodeElement } from "../../components/code";



export class ExportOptions {
    container: CustomContainer;
    rawButtonPanel: HTMLDivElement;
    tableDropdown: CustomDropdownElement;
    csvCodeElement: CustomCodeElement;
    constructor(
        container: HTMLDivElement,
    ) {
        
        this.container = new CustomContainer(container, "Export", "exportContainer");

        new CustomHeading(this.container.contentContainer, "Export Raw Data", undefined, 3);
        new CustomParagraph(this.container.contentContainer, "Export the raw data from a SQL table to a CSV file that can be opened in many programs such as Excel");
        this.tableDropdown = new CustomDropdownElement(this.container.contentContainer, "SQL Table", [], false);
        this.rawButtonPanel = utils.createElement("div", this.container.contentContainer, ["buttonPanel"]);



        new CustomButtonElement(this.rawButtonPanel, "Export Table", "icons/exportIcon.svg", [], () => {
            this.exportTable();
        });

        this.csvCodeElement = new CustomCodeElement(this.container.contentContainer, "", ["hide"]);

        db.getTableNames()
        .then(tables => {
            if (!(tables instanceof Array)) return;

            tables.forEach(table => {
                if (typeof table === "string")  {
                    this.tableDropdown.addItem(new DropDownItem(table, table));
                }

            });
            
        })
    }


    exportTable() {
        const table = this.tableDropdown.value;
        if (table === undefined) {
            alert("Select a table");
            return;
        }

        if (typeof table === "number") {
            console.error("The export table recived a number, not a table name");
            return;
        }

        db.debugTable(table, false)
        .then(result => {
            let csv = "";
            if (!(result instanceof Array)){
                console.error("The result has to be an array");
                return;
            }
            result.forEach(row => {
                if (!(row instanceof Array)){
                    console.error("The rows have to be arrays");
                    return;
                }
                
                row.forEach(element => {
                    csv += String(element) + ", "
                })
                csv += "\n"
            })

            console.log(csv);

            this.csvCodeElement.setContent(csv);
            this.csvCodeElement.show();
        })
    


    }
}