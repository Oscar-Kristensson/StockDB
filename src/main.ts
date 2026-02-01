import { invoke } from "@tauri-apps/api/core";
import { dbAddUser } from "./db.ts";
import { LayerSwitcher } from "./appLayer.ts";
import { firstLayer, firstLayer2, firstLayer3 } from "./views/testLayers.ts";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
    if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", {
        name: greetInputEl.value,
        });
    }
}


async function myTestCommand() {
    await invoke("my_test_command");
}

let layerSwitcher: LayerSwitcher | null;
let navContainer: HTMLElement | null = document.querySelector("nav");

function init() {
    if (!navContainer) {
        console.error("Could not find navContainer -> could not create layerSwitcher");
        return;
    }


    layerSwitcher = new LayerSwitcher(navContainer);
    layerSwitcher.addLayer(firstLayer);
    layerSwitcher.addLayer(firstLayer2);
    layerSwitcher.addLayer(firstLayer3);
}

window.addEventListener("DOMContentLoaded", () => {
    greetInputEl = document.querySelector("#greet-input");
    greetMsgEl = document.querySelector("#greet-msg");
    document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        greet();
    });


    const addUserButton = document.querySelector("#addUser-button");
    const addUserInput = document.querySelector("#addUser-input");    
    
    console.log(addUserButton, addUserInput)

    addUserButton?.addEventListener("click", () => {
        console.log("On Event!");
        let userName: string | null;

        if (addUserInput instanceof HTMLInputElement) {
            userName = addUserInput?.value;
        } else {
            return;
        }
        if (userName !== null) {
            dbAddUser(userName);
        }
        else 
        {
            console.error("Could not add user with the name", userName);
        }
    })
    
    myTestCommand();

    init();

});
