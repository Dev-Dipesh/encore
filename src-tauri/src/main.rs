// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{info, trace};

const ACCEPTABLE_CHARS: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]{}|,.<>/?;:'\"\\`~+-=_ ";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn transform(user_string: &str, shift: i32, action: &str) -> String {
    trace!("Commencing transformation...");
    if action == "encode" {
        info!("Encoding string");
        encrypt(user_string, shift)
    } else {
        info!("Decoding string");
        decrypt(user_string, shift)
    }
}

fn encrypt(input: &str, shift: i32) -> String {
    let acceptable_chars: Vec<char> = ACCEPTABLE_CHARS.chars().collect();
    let len = acceptable_chars.len() as i32;
    let mut encrypted = String::new();

    for ch in input.chars() {
        if let Some(pos) = acceptable_chars.iter().position(|&c| c == ch) {
            let new_pos = (pos as i32 + shift).rem_euclid(len);
            encrypted.push(acceptable_chars[new_pos as usize]);
        }
    }

    encrypted
}

fn decrypt(input: &str, shift: i32) -> String {
    let acceptable_chars: Vec<char> = ACCEPTABLE_CHARS.chars().collect();
    let len = acceptable_chars.len() as i32;
    let mut decrypted = String::new();

    for ch in input.chars() {
        if let Some(pos) = acceptable_chars.iter().position(|&c| c == ch) {
            let new_pos = (pos as i32 - shift).rem_euclid(len);
            decrypted.push(acceptable_chars[new_pos as usize]);
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
