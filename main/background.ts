import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

import { autoUpdater } from "electron-updater";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("ready", function () {
  console.log("Checking for updates...");
  autoUpdater.checkForUpdates();
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("Installing updates...");
  autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
  app.quit();
});
