import { invoke } from "@tauri-apps/api/core";


export function dbAddUser(name:string) {
    console.log("Adding user");
    invoke("db_add_user", {
        name: name,
    })
}
