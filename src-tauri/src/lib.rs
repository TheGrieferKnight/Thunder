use serde::{Deserialize, Serialize};
use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};

mod commands;
mod models;

use crate::commands::balls::greet;
use crate::models::balls::Baller;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 1. We "collect" all functions with #[specta::specta]
    let commands = collect_commands![commands::balls::greet];

    // 2. We configure the TypeScript generator
    let builder = Builder::<tauri::Wry>::new().commands(commands);

    // 3. In "Debug" mode, we export the file to our React src folder
    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
