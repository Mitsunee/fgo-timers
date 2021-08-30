import { createStore } from "nanostores";

export const clientStore = createStore(() => {
  if (typeof window !== "undefined") {
    clientStore.set({
      width: window.innerWidth,
      height: window.innerHeight
    });
  } else {
    clientStore.set({
      width: 0,
      height: 0
    });
  }
});

function updateClient() {
  if (typeof window !== "undefined") {
    clientStore.set({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("resize", updateClient);
  updateClient();
}
