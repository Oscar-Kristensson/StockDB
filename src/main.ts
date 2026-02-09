import { invoke } from "@tauri-apps/api/core";
import { dbAddUser, dbDebugTable, dbGetStockInfoById } from "./db.ts";
import { firstLayer, firstLayer2, firstLayer3 } from "./views/testLayers.ts";
import { stockLayer } from "./views/stockLayer.ts";
import { StockDB } from "./app.ts";

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

let stockDb: StockDB | null;
let navContainer: HTMLElement | null;
let mainContainer: HTMLElement | null;





function init() {
    navContainer = document.querySelector("nav");
    mainContainer = document.querySelector("main");

    if (!navContainer || !mainContainer) {
        console.error("Failed to load main container!");
        prompt("Failed to load UI");
        return;
    }


    if (!navContainer) {
        console.error("Could not find navContainer -> could not create layerSwitcher");
        return;
    }


    stockDb = new StockDB(navContainer, mainContainer);
    
    // Load the starting layer
    stockDb.addLayer(stockLayer);
    stockDb.loadLayer(stockLayer);


    stockDb.addLayer(firstLayer);
    stockDb.addLayer(firstLayer2);
    stockDb.addLayer(firstLayer3);


    console.log("ID -> Stock");
    dbGetStockInfoById(2)
    .then(result => {
        console.log("Recieved", result);
        if (result === null) {
            console.warn("There is no stock with the ID");
        } else if (stockDb){
            stockDb.stock = result;
        }
    })

    stockDb.initalize();    
}






function test() {
    console.log("BF Debug Table");
    // addStock();
    dbDebugTable("users");
    dbDebugTable("stock");
    dbGetStockInfoById(0);
}


window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
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

    test();

});
