#![allow(dead_code)]

use serde::Serialize;
use specta::Type;
use thiserror::Error;

#[derive(Debug, Error, Serialize, Type)]
#[serde(tag = "type", content = "message")]
pub enum AppError {
    #[error("Database error: {0}")]
    Db(String),

    #[error("Match ingestion failed: {0}")]
    Ingestion(String),

    #[error("Io error: {0}")]
    Io(String),
}

// Global result type for our backend
pub type AppResult<T> = Result<T, AppError>;
