import '@logseq/libs'

import { handlePopup } from './handle-popup'
import { settings } from './settings'

const main = async () => {
  console.log('<insert-plugin-name> loaded')

  // Used to handle any popups
  handlePopup()

  // Check if plugin is being used on the DB version
  const isDbGraph = await logseq.App.checkCurrentIsDbGraph()
  console.log(isDbGraph)
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
