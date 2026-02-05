use crate::error::{AppError, AppResult};
use duckdb::Connection;
use parking_lot::Mutex;
use std::path::PathBuf;

// DB Connection gets wrapped in a Mutex so that it can only be accessed
// by one Command at a time (avoid data races)
pub struct DbState {
    pub conn: Mutex<Connection>,
}

impl DbState {
    pub fn new(db_path: PathBuf) -> AppResult<Self> {
        // Open connection to local file, may be changed later
        let conn = Connection::open(db_path).map_err(|e| AppError::Db(e.to_string()))?;
        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    pub fn init_schema(&self) -> AppResult<()> {
        let conn = self.conn.lock();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS matches (
                match_id VARCHAR PRIMARY KEY,
                data JSON -- We will refine this to nested columns next
            );",
        )
        .map_err(|e| AppError::Db(e.to_string()))
    }
}
