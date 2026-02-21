import { invoke } from "@tauri-apps/api/core";


export namespace os {
    export function getDataDir() {
        return new Promise((resolve, reject) => {
            invoke("os_get_data_dir")
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            })

        });
    }
}