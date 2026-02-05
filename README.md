# Doc Mode

A Logseq plugin that provides a toggleable "Document Mode" for your notes. When enabled, it renders your notes like a document and prevents accidental edits when clicking on text.

## Features

- **Toggle Document Mode** - Prevents accidental edits by disabling block editing
- **Toolbar Button** - Convenient toggle button with visual state indicator (outline/filled icon)
- **Keyboard Shortcut** - `Ctrl+Shift+Q` (Windows/Linux) or `Cmd+Shift+Q` (Mac)
- **Temporary Edit Mode** - Hold `q` to temporarily enable editing (when not typing in search/editor)
- **Command Palette** - Search "Toggle Doc Mode" in the command palette
- **Remember State** - Optional setting to restore Doc Mode on startup

## Usage

1. **Toggle via toolbar**: Click the book icon in the toolbar
2. **Toggle via keyboard**: Press `Ctrl/Cmd + Shift + Q`
3. **Toggle via command palette**: Press `Ctrl/Cmd + Shift + P` and search "Toggle Doc Mode"

When Doc Mode is **enabled**:
- The toolbar icon changes to a filled book
- A colored border appears on the left side of the content
- Clicking on text will NOT enter edit mode
- You can still select and copy text

When Doc Mode is **disabled**:
- The toolbar icon shows an outline book
- Normal editing behavior is restored

## Settings

- **Enable on Startup**: Automatically enable Doc Mode when Logseq starts (restores previous state)

## Installation

Recommend to install from the marketplace. If not, download a release and manually load it in Logseq:

1. Download the latest release zip file
2. In Logseq, go to Settings → Plugins → Load unpacked plugin
3. Select the extracted plugin folder
