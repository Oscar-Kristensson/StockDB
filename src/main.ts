import { invoke } from "@tauri-apps/api/core";
import * as db from "./db";
import { firstLayer, firstLayer2, firstLayer3 } from "./views/testLayers.ts";
import { stockLayer } from "./views/stockLayer/stockLayer.ts";
import { StockDB } from "./app.ts";
import { logLayer } from "./views/logLayer/layer.ts";
import { settingsLayer } from "./views/settings/layer.ts";

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

    stockDb.addLayer(logLayer);
    stockDb.addLayer(settingsLayer);


    stockDb.addLayer(firstLayer);
    stockDb.addLayer(firstLayer2);
    stockDb.addLayer(firstLayer3);


    db.getStockInfoById(1)
    .then(result => {
        if (result === null) {
            console.warn("There is no stock with the ID. The result gave", result);
        } else if (stockDb){
            stockDb.stock = result;
        }
    })

    stockDb.initalize();    
}






function test() {
    // addStock();
    db.getStockInfoById(0);

    db.getTableNames()
    .then(result => {
        console.log("Tables", result);
        if (result instanceof Array) {
            result.forEach(tableName => {
                db.debugTable(tableName);
            })
        }
    })

    db.addQuarterly(1, 2026, 2, 100, 200, 300, 400, 500, "SEK")
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    })

    db.getQuarterlyFromStockID(1)
    .then(result => {
        console.log(result);
    })
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
    

    addUserButton?.addEventListener("click", () => {
        console.log("On Event!");
        let userName: string | null;

        if (addUserInput instanceof HTMLInputElement) {
            userName = addUserInput?.value;
        } else {
            return;
        }
        if (userName !== null) {
            db.addUser(userName);
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
