// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{info, trace};

const ACCEPTABLE_CHARS: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]{}|,.<>/?;:'\"\\`~+-=_ ";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn transform(user_string: &str, action: &str) -> String {
    trace!("Commencing transformation...");
    if action == "encode" {
        info!("Encoding string");
        encrypt(user_string, 3)
    } else {
        info!("Decoding string");
        decrypt(user_string, 3)
    }
}

fn encrypt(input: &str, shift: usize) -> String {
    let acceptable_chars: Vec<char> = ACCEPTABLE_CHARS.chars().collect();
    let mut encrypted = String::new();

    for ch in input.chars() {
        if let Some(pos) = acceptable_chars.iter().position(|&c| c == ch) {
            let new_pos = (pos + shift) % acceptable_chars.len();
            encrypted.push(acceptable_chars[new_pos]);
        }
    }

    encrypted
}

fn decrypt(encrypted: &str, shift: usize) -> String {
    let acceptable_chars: Vec<char> = ACCEPTABLE_CHARS.chars().collect();
    let mut decrypted = String::new();

    for ch in encrypted.chars() {
        if let Some(pos) = acceptable_chars.iter().position(|&c| c == ch) {
            let new_pos = (pos + acceptable_chars.len() - shift) % acceptable_chars.len();
            decrypted.push(acceptable_chars[new_pos]);
        }
    }

    decrypted
}

fn main() {
    // Initialize the logger
    // #[cfg(debug_assertions)]
    // let devtools = devtools::init(); // initialize the plugin as early as possible

    // Initialize the Tauri application
    let builder = tauri::Builder::default();

    // #[cfg(debug_assertions)]
    // builder = builder.plugin(devtools); // then register it with Tauri
    
    builder
        .invoke_handler(tauri::generate_handler![transform])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
