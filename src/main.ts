import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

let transformInputEl: HTMLInputElement | null;
let transformShiftEl: HTMLInputElement | null;
let transformMsgEl: HTMLElement | null;
let transformActionType: HTMLElement | null;
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
  if (
    transformMsgEl &&
    transformInputEl &&
    transformShiftEl &&
    transformActionType
  ) {
    const action = getSelectedValue();

    if (action === "encode") {
      transformActionType.textContent = "Encoded:";
    } else {
      transformActionType.textContent = "Decoded:";
    }

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    transformMsgEl.textContent = await invoke("transform", {
      userString: transformInputEl.value.trim(),
      shift: parseInt(transformShiftEl.value),
      action: getSelectedValue(),
    });
  }
}

async function copyText() {
  if (transformMsgEl) {
    const text = transformMsgEl.innerText;

    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied to clipboard: " + text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text");
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  transformInputEl = document.querySelector("#encoded-input");
  transformShiftEl = document.querySelector("#shift");
  transformMsgEl = document.querySelector(".encoded-block__str");
  transformActionType = document.querySelector(".encoded-block__action");
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
    if (transformInputEl?.value !== "" && transformShiftEl?.value !== "") {
      toggleFormError("", false);
      transform();
      if (encodedBlockDiv) encodedBlockDiv.style.display = "flex";
    } else if (transformShiftEl?.value === "") {
      toggleFormError("Please enter a shift value", true);
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
    if (transformShiftEl) transformShiftEl.value = "";
    if (encodedBlockDiv) encodedBlockDiv.style.display = "none";
  });
});
