use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct Baller {
    pub name: String,
    pub age: i32,
}
