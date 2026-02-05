set shell := ["nu.exe", "-c"]

alias t := test
[working-directory: 'src-tauri']
test:
    cargo fmt --all -- --check
    cargo clippy -- -D warnings
    cargo test
    cargo check
