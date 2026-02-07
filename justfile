set shell := ["nu.exe", "-c"]

alias t := test
[working-directory: 'src-tauri']
test:
    cargo fmt --all -- --check
    cargo clippy -- -D warnings
    cargo test
    cargo check

alias l := lint
[working-directory: 'src-tauri']
lint:
    cargo fmt --all
    cargo clippy
