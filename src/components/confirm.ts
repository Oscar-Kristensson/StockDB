// components/confirmDialog.ts
import * as utils from "../utils";
import { CustomButtonElement } from "./button.ts";

export class CustomConfirmDialog {
    overlay: HTMLDivElement;
    dialog: HTMLDivElement;

    constructor(
        title: string,
        message: string,
        onConfirm: () => void,
        confirmLabel: string = "Delete",
        cancelLabel: string = "Cancel",
    ) {
        this.overlay = utils.createElement("div", document.body, ["confirmDialogOverlay"]);
        this.dialog = utils.createElement("div", this.overlay, ["confirmDialog"]);

        const titleEl = utils.createElement("h3", this.dialog, ["confirmTitle"]);
        titleEl.textContent = title;

        const messageEl = utils.createElement("p", this.dialog, ["confirmMessage"]);
        messageEl.textContent = message;

        const buttonRow = utils.createElement("div", this.dialog, ["confirmButtonRow"]);

        new CustomButtonElement(buttonRow, cancelLabel, "", ["cancelBtn"], () => this.close());
        new CustomButtonElement(buttonRow, confirmLabel, "", ["confirmBtn", "danger"], () => {
            onConfirm();
            this.close();
        });

        // Click outside dialog closes it
        this.overlay.addEventListener("click", (e) => {
            if (e.target === this.overlay) this.close();
        });
    }

    close() {
        this.overlay.remove();
    }
}