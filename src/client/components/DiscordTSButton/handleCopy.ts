function supportsNavigator(): boolean {
  return Boolean(window.navigator?.clipboard?.writeText);
}

async function copyToClipboard(str: string) {
  try {
    await window.navigator.clipboard.writeText(str);
    return true;
  } catch {
    return false;
  }
}

function legacyCopyToClipboard(str: string) {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

type ButtonClickEvent = Parameters<
  React.MouseEventHandler<React.ElementRef<"button">>
>[0];

export async function handleCopy(ev: ButtonClickEvent, str: string) {
  if (!supportsNavigator()) {
    try {
      legacyCopyToClipboard(str);
      ev.currentTarget.focus();
      return true;
    } catch {
      console.error("Failed to copy to clipboard");
      return false;
    }
  }

  return copyToClipboard(str);
}
