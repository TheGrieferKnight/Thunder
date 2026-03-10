use serde_json::{Map, Value};
use tauri::State;

use crate::models::balls::Baller;
use crate::services::database::DbState;

#[tauri::command]
#[specta::specta]
pub fn greet(name: &str) -> Baller {
    let _ = format!("Hello, {}! You've been greeted from Rust!", name);
    Baller {
        name: "sheesh".into(),
        age: 15,
    }
}
#[tauri::command]
#[specta::specta]
pub async fn run_unchecked_db_query(
    state: State<'_, DbState>,
    sql: String,
) -> Result<Vec<Value>, String> {
    let mut dbstate = state.conn.lock();
    let mut stmt = dbstate.prepare(&sql).map_err(|e| e.to_string())?;

    // 1. Execute the query first
    let mut rows = stmt.query([]).map_err(|e| e.to_string())?;

    // 2. Get column names from the Rows object (Safe way)
    // We use rows.as_ref() to access the statement metadata after execution
    let col_names: Vec<String> = rows
        .as_ref()
        .map(|s| {
            s.column_names()
                .into_iter()
                .map(|n| n.to_string())
                .collect()
        })
        .unwrap_or_default();

    let mut results = Vec::new();

    // 3. Iterate through rows
    while let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let mut row_map = Map::new();

        for (i, name) in col_names.iter().enumerate() {
            let json_val = match row.get_ref(i).map_err(|e| e.to_string())? {
                duckdb::types::ValueRef::Null => Value::Null,
                duckdb::types::ValueRef::Boolean(b) => Value::Bool(b),
                duckdb::types::ValueRef::Int(i) => Value::Number(i.into()),
                duckdb::types::ValueRef::BigInt(i) => Value::Number(i.into()),
                duckdb::types::ValueRef::Float(f) => Value::from(f),
                duckdb::types::ValueRef::Double(f) => Value::from(f),
                duckdb::types::ValueRef::Text(t) => {
                    Value::String(String::from_utf8_lossy(t).to_string())
                }
                duckdb::types::ValueRef::Blob(b) => {
                    Value::String(String::from_utf8_lossy(b).to_string())
                }
                _ => Value::String("UNSUPPORTED_TYPE".to_string()),
            };
            row_map.insert(name.clone(), json_val);
        }
        results.push(Value::Object(row_map));
    }
    drop(dbstate);
    Ok(results)
}
