# EditorJumper-V

<div align="center">
  <img src="image/pluginIcon.png" alt="EditorJumper Icon" width="128" height="128"/>
</div>

<div >
  <img src="https://img.shields.io/badge/VS%20Code-Extension-blue" alt="VS Code Extension"/>
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License"/>
  <a href="README_CN.md"><img src="https://img.shields.io/badge/文档-中文版-red.svg" alt="Chinese Doc"/></a>
</div>

## 🔍 Introduction

EditorJumper-V is a VS Code-compatible extension that allows you to seamlessly jump between modern code editors (VS Code, Cursor, Windsurf, Void, Kiro, Qoder, etc.) and JetBrains IDEs (such as IntelliJ IDEA, WebStorm, PyCharm, etc.). It maintains your cursor position and editing context, greatly improving development efficiency in multi-editor environments.

<div align="center">
  <img src="image/JumpAndBack.gif" alt="Jump and Back Demo" width="800"/>
</div>

<div align="center">
  <img src="image/ConfigurationPanel.png" alt="Configuration Panel" width="600"/>
</div>

## 🌟 Features

- 🚀 **Seamless Editor Switching**
  - Quickly jump from VS Code, Cursor, Windsurf, Void, Kiro, Qoder to JetBrains IDEs
  - Automatically positions to the same cursor location (line and column)
  - Perfectly maintains editing context without interrupting workflow

- 🎯 **Smart Jump Behavior**
  - With file open: Opens the same project and file in the target IDE, preserving cursor position
  - Without file open: Opens the project directly in the target IDE

- ⚡ **Multiple Trigger Methods**
  - Right-click in editor - select "Open in JetBrains IDE"
  - Right-click in file explorer - select "Open in JetBrains IDE"
  - Standard mode jump - Shift+Alt+O (default keyboard shortcut)
  - Fast mode jump (Mac) - Shift+Alt+P (optimized for speed, especially on macOS)

- 🎚️ **Easy Target IDE Selection**
  - Status bar widget - click the IDE icon to select which JetBrains IDE to jump to
  
<div align="center">
  <img src="image/changeTargetIDE.png" alt="Change Target IDE" width="600"/>
</div>

## 💻 System Requirements

- VS Code 1.81.0 or higher, or other supported editors (Cursor, Windsurf, Void, Kiro, Qoder)
- Installed JetBrains IDE (IntelliJ IDEA, WebStorm, PyCharm, etc.)

## 📥 Installation

1. Open VS Code (or other supported editor)
2. Go to Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "EditorJumper"
4. Click the Install button

## ⚙️ Configuration

1. Click the IDE icon in the status bar
2. Select "$(gear) Configure EditorJumper" to open configuration panel
3. Configure the following options:
   - Select default JetBrains IDE
   - Add or edit IDE configurations
   - Set IDE command paths (if needed)

### Configuration Panel

The configuration panel allows you to:
- Add new IDE configurations
- Edit existing IDE configurations
- Hide unnecessary IDEs
- Select default IDE

For each IDE, you can configure:
- IDE name
- Command path (required for custom IDEs)
- Whether to hide in selection list

> **Configuration Notes:**
> - macOS: All JetBrains IDEs work without additional configuration, using command-line tools automatically
> - Windows: Need to configure IDE command-line tool paths
> - Linux: Need to configure IDE command-line tool paths
>
> **Best Practices:**
> - Use JetBrains Toolbox to manage IDEs, which automatically creates command-line tools
> - Or create command-line launcher in IDE via Tools → Create Command-line Launcher

## 🚀 Usage

### Via Keyboard Shortcuts

| Scenario | Shift+Alt+O | Shift+Alt+P (Mac Fast Mode) |
|----------|-------------|---------------------------|
| **On project folder** | Open project | Ultra-fast open project |
| **On specific file** | Open project + file | Mac faster (requires project to be opened first, otherwise only opens file), Windows same as standard |

**Recommendations:**
- **Windows Users**: Use Shift+Alt+O (meets all needs)
- **Mac Users**: Use Shift+Alt+O, then switch to Shift+Alt+P for faster experience once familiar

### Via Context Menu

1. Right-click in the editor or file explorer
2. Select "Open in JetBrains IDE"

### Change Jump Target in Status Bar

1. Click the IDE icon in the bottom status bar
2. Select the target JetBrains IDE from the dropdown menu
3. Use any trigger method above to execute the jump

## 🔄 Complementary Use

> Recommended for use with [EditorJumper](https://github.com/wanniwa/EditorJumper) to quickly return from JetBrains IDE to VS Code, Cursor, Windsurf, Void, Kiro, Qoder, and other editors

Using both tools creates a seamless development experience across all your favorite editors.

## 🤝 Contribution

Pull Requests and Issues are welcome to help improve this extension!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Frequently Asked Questions

### Q: What should I do if EditorJumper doesn't respond or throws an error when jumping to IntelliJ IDEA on Mac?

**Solution:**

1. Open IntelliJ IDEA
2. Select `Tools` from the menu bar
3. Click `Create Command-line Launcher...`
4. Follow the prompts to complete the setup

This ensures that the command-line launcher is properly configured, resolving the jump issue.

<div align="center">
  <img src="image/macCreateCommand-line.png" alt="macCreateCommand-line" width="600"/>
</div>

### Q: How to add a custom IDE?

1. Open EditorJumper configuration panel
2. Click "Add New IDE" button
3. Check "Custom IDE"
4. Enter IDE name and command path
5. Click Save

### Q: Why doesn't fast mode (Shift+Alt+P) work on Windows?

Fast mode is a feature optimized for macOS and automatically falls back to standard mode on Windows. Windows users can get the best experience using Shift+Alt+O.

---