use crate::models::balls::Baller;

#[tauri::command]
#[specta::specta]
pub fn greet(name: &str) -> Baller {
    let _ = format!("Hello, {}! You've been greeted from Rust!", name);
    Baller {
        name: "sheesh".into(),
        age: 15,
    }
}
