import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

let transformInputEl: HTMLInputElement | null;
let transformMsgEl: HTMLElement | null;
let transformFormErrorEl: HTMLElement | null;
let encodedBlockDiv: HTMLElement | null;
let encodedBlockBtn: HTMLElement | null;

function getSelectedValue() {
  var radios = document.getElementsByName("switch_2");
  for (var i = 0; i < radios.length; i++) {
    let radio = radios[i] as HTMLInputElement;
    if (radio.checked) {
      return radio.value;
    }
  }
}

function toggleFormError(err: string, show: boolean) {
  if (transformFormErrorEl) {
    transformFormErrorEl.style.cssText = `
      display: ${show ? "block" : "none"};
      text-align: left;
      padding-left: 5px;
    `;
    transformFormErrorEl.textContent = err;
  }
}

async function transform() {
  if (transformMsgEl && transformInputEl) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    transformMsgEl.textContent = await invoke("transform", {
      userString: transformInputEl.value.trim(),
      action: getSelectedValue(),
    });
  }
}

function copyText() {
  if (transformMsgEl) {
    const text = transformMsgEl.innerText;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Text copied to clipboard: " + text);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  transformInputEl = document.querySelector("#encoded-input");
  transformMsgEl = document.querySelector("#encoded-block__str");
  transformFormErrorEl = document.querySelector(".transform-form__error");
  encodedBlockDiv = document.querySelector(".encoded-block");
  encodedBlockBtn = document.querySelector(".encoded-block__btn");

  document
    .getElementById("titlebar-minimize")
    ?.addEventListener("click", () => appWindow.minimize());
  document
    .getElementById("titlebar-maximize")
    ?.addEventListener("click", () => appWindow.toggleMaximize());
  document
    .getElementById("titlebar-close")
    ?.addEventListener("click", () => appWindow.close());

  document.querySelector("#transform-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (transformInputEl?.value !== "") {
      toggleFormError("", false);
      transform();
      if (encodedBlockDiv) encodedBlockDiv.style.display = "flex";
    } else {
      toggleFormError("Please enter a string to transform", true);
    }
  });

  // Attach copyText function to the button click event
  encodedBlockBtn?.addEventListener("click", copyText);

  // Clear Input and hide error message
  document.querySelector(".clear-input")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (transformInputEl) {
      transformInputEl.value = "";
      toggleFormError("", false);
    }
    if (encodedBlockDiv) encodedBlockDiv.style.display = "none";
  });
});
