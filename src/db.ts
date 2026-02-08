import { invoke } from "@tauri-apps/api/core";


export function dbAddUser(name:string) {
    console.log("Adding user");
    invoke("db_add_user", {
        name: name,
    })
}


export function dbDebugTable(table: string) {
    invoke("db_debug_table", {
        table: table,
    })
    .then(result => {
        let rv:string = "";
        if (result instanceof Array) {
            result.forEach(row => {
                if (row instanceof Array){
                    row.forEach(element => {
                        if (typeof element === "string")
                            rv += element + "\t";
                    })
                }
                rv += "\n";
            });
        }

        console.log(rv);

    })
}