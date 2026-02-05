import '@logseq/libs'

import { settings } from './settings'

// CSS styles for document mode
const docModeCSS = `
/* Disable pointer events on editable content to prevent accidental edits */
.ls-block .block-content-wrapper {
  pointer-events: none !important;
  cursor: default !important;
}

/* Keep text selectable for reading/copying */
.ls-block .block-content {
  user-select: text !important;
  cursor: text !important;
}

/* Keep {{renderer}} and other interactive elements clickable */
.ls-block .macro,
.ls-block .inline,
.ls-block [data-macro-name],
.ls-block .asset-container,
// .ls-block .embed-block,
// .ls-block .embed-page,
.ls-block iframe,
.ls-block video,
.ls-block audio,
.ls-block a,
.ls-block button,
.ls-block input,
.ls-block .checkbox {
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* Disable bullet click to prevent block collapsing */
.ls-block .bullet-container {
  pointer-events: none !important;
}

/* Prevent block reference clicks from editing */
.ls-block .block-ref {
  pointer-events: none !important;
}

/* Visual indicator - subtle border on the page */
#main-content-container {
  border-left: 3px solid var(--ls-active-primary-color, #007AFF) !important;
  transition: border-left 0.2s ease;
}
`

let isDocModeEnabled = false

/**
 * Updates the toolbar button icon based on doc mode state
 */
const updateToolbarButton = () => {
  // Use different Tabler icons for on/off states
  // ti-book (outline) for OFF, ti-book-2 (filled) for ON
  const iconClass = isDocModeEnabled ? 'ti ti-book-2' : 'ti ti-book'
  const title = isDocModeEnabled ? 'Disable Doc Mode' : 'Enable Doc Mode'
  const activeStyle = isDocModeEnabled ? 'color: var(--ls-active-primary-color, #007AFF);' : ''

  logseq.App.registerUIItem('toolbar', {
    key: 'doc-mode-toggle',
    template: `
      <a class="button" data-on-click="toggleDocMode" title="${title}">
        <i class="${iconClass}" style="font-size: 20px; ${activeStyle}"></i>
      </a>
    `,
  })
}

/**
 * Toggles document mode on/off
 */
const toggleDocMode = async () => {
  isDocModeEnabled = !isDocModeEnabled

  if (isDocModeEnabled) {
    // Inject CSS to prevent edits
    logseq.provideStyle({ key: 'doc-mode-styles', style: docModeCSS })
    logseq.UI.showMsg('Doc Mode enabled', 'success', { timeout: 2000 })
  } else {
    // Remove the injected CSS - find all style elements with our key
    const styleElements = parent.document.querySelectorAll('style[data-injected-style*="doc-mode-styles"]')
    styleElements.forEach((el) => el.remove())

    // Also try the ID-based approach as fallback
    const styleById = parent.document.getElementById('logseq-plugin-toggle-document-mode--doc-mode-styles')
    styleById?.remove()

    logseq.UI.showMsg('Doc Mode disabled', 'info', { timeout: 2000 })
  }

  // Update button appearance
  updateToolbarButton()

  // Persist state to settings
  logseq.updateSettings({ docModeState: isDocModeEnabled })
}

/**
 * Main plugin entry point
 */
const main = async () => {
  console.log('Doc Mode plugin loaded')

  // Restore previous state if "enable on startup" is set
  const enableOnStartup = logseq.settings?.enableOnStartup ?? false
  const previousState = logseq.settings?.docModeState ?? false

  if (enableOnStartup && previousState) {
    isDocModeEnabled = true
    logseq.provideStyle({ key: 'doc-mode-styles', style: docModeCSS })
  }

  // Register the toggle command for toolbar clicks
  logseq.provideModel({
    toggleDocMode,
  })

  // Register toolbar button
  updateToolbarButton()

  // Register keyboard shortcut (Ctrl/Cmd + Shift + Q)
  logseq.App.registerCommandShortcut(
    { binding: 'mod+shift+q' },
    toggleDocMode
  )

  // Register command palette entry
  logseq.App.registerCommandPalette(
    {
      key: 'toggle-doc-mode',
      label: 'Toggle Doc Mode',
      keybinding: { binding: 'mod+shift+q' },
    },
    toggleDocMode
  )

  // Temporary edit mode (Hold 'q')
  let isTempEdit = false

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore if user is typing in an input field (search, editor, etc.)
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

    // Check for single 'q' key (no modifiers)
    if (e.key.toLowerCase() === 'q' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      // If we are already in temp edit (key held down), just prevent default to stop 'qqqq'
      if (isTempEdit) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      if (isDocModeEnabled) {
        isTempEdit = true
        e.preventDefault()
        e.stopPropagation()

        // Remove styles temporarily
        const styleElements = parent.document.querySelectorAll('style[data-injected-style*="doc-mode-styles"]')
        styleElements.forEach((el) => el.remove())
        const styleById = parent.document.getElementById('logseq-plugin-toggle-document-mode--doc-mode-styles')
        styleById?.remove()

        logseq.UI.showMsg('Temporary Edit Mode', 'info', { timeout: 1000 })
      }
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'q') {
      // Only restore if we were properly in temp edit mode
      // (This prevents keyup from 'q' typed in an editor from re-enabling doc mode weirdly if logic gets crossed)
      if (isDocModeEnabled && isTempEdit) {

        // We need to double check we aren't currently editing a block?
        // Actually, if they release Q, they probably want doc mode back immediately.

        isTempEdit = false
        // Restore styles
        logseq.provideStyle({ key: 'doc-mode-styles', style: docModeCSS })
      }
    }
  }

  // Use capture phase (true) to intercept events before Logseq/CodeMirror handles them
  parent.document.addEventListener('keydown', handleKeyDown, true)
  parent.document.addEventListener('keyup', handleKeyUp, true)

  // Cleanup listeners on plugin unload (if Logseq supported unload hooks properly, but for now we rely on reload)
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
