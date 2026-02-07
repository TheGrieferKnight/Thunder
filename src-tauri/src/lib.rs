use specta_typescript::Typescript;
use tauri::Manager;

use crate::commands::analytics::greet;
use crate::services::database::DbState;

mod commands;
mod error;
mod infrastructure;
mod models;
mod services;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    //
    // 1. Collect all commands
    let commands = tauri_specta::collect_commands![greet];

    // 2. Configure the TypeScript bindings generator
    let specta_builder = tauri_specta::Builder::<tauri::Wry>::new().commands(commands);

    // 3. Outside of builds export bindings for React
    #[cfg(debug_assertions)]
    specta_builder
        .export(Typescript::default(), "../src/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data dir");
            std::fs::create_dir_all(&app_data_dir).ok();

            let db_path = app_data_dir.join("lol_analytics.db");
            let db_state = DbState::new(db_path)?;

            db_state.init_schema()?;

            app.manage(db_state);

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        // Use specta_builder.invoke_handler() instead of collecting commands twice
        .invoke_handler(specta_builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
