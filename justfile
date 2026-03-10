set shell := ["nu.exe", "-c"]

alias s := start

start:
	clear
	bun run tauri dev

alias t := test
[working-directory: 'src-tauri']
test:
    cargo +nightly fmt --all -- --check
    cargo clippy -- -D warnings
    cargo test
    cargo check

alias l := lint
[working-directory: 'src-tauri']
lint:
    cargo +nightly fmt --all
    cargo clippy
