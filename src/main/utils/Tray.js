import { app, Tray, Menu } from 'electron'
import iconPath from '../../../resources/icon.png?asset'
import { name } from '../../../package.json'

const createTray = (mainWindow) => {
  const tray = new Tray(iconPath);
  const contextMenu = [
    {
      label: '显示窗口', click: function () {
        mainWindow.show()
      }
    },
    {
      label: '退出', click: function () {
        app.exit()
      }
    }
  ]
  const menu = Menu.buildFromTemplate(contextMenu);
  tray.setToolTip(name);
  tray.setContextMenu(menu);
  tray.on('click', () => {
    mainWindow.setSkipTaskbar(false);
    mainWindow.show()
  })
}

export { createTray }