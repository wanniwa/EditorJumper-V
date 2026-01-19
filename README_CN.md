# EditorJumper-V

<div align="center">
  <img src="image/pluginIcon.png" alt="EditorJumper 图标" width="128" height="128"/>
</div>

<div >
  <img src="https://img.shields.io/badge/VS%20Code-Extension-blue" alt="VS Code 扩展"/>
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="许可证"/>
  <a href="README.md"><img src="https://img.shields.io/badge/Doc-English-blue.svg" alt="English Doc"/></a>
</div>

## 🔍 简介

EditorJumper-V 是一个 VS Code 类编辑器扩展，允许您在现代代码编辑器（VS Code、Cursor、Windsurf、Void、Kiro、Qoder 等）和 JetBrains IDE（如 IntelliJ IDEA、WebStorm、PyCharm 等）之间无缝跳转。它能够保持光标位置和编辑上下文，大大提高多编辑器环境中的开发效率。

<div align="center">
  <img src="image/JumpAndBack.gif" alt="跳转演示" width="800"/>
</div>

<div align="center">
  <img src="image/ConfigurationPanel.png" alt="配置面板" width="600"/>
</div>

## 🌟 功能特点

- 🚀 **无缝编辑器切换**
  - 快速从 VS Code、Cursor、Windsurf、Void、Kiro、Qoder 等跳转到 JetBrains IDE
  - 自动定位到相同的光标位置（行和列）
  - 完美保持编辑上下文，不中断工作流

- 🎯 **智能跳转行为**
  - 有文件打开时：在目标 IDE 中打开相同的项目和文件，保持光标位置
  - 无文件打开时：直接在目标 IDE 中打开项目

- ⚡ **多种触发方式**
  - 编辑器中右键点击 - 选择"在 JetBrains IDE 中打开"
  - 文件资源管理器中右键点击 - 选择"在 JetBrains IDE 中打开"
  - 标准模式跳转 - Shift+Alt+O（默认键盘快捷键）
  - 快速模式跳转（Mac）- Shift+Alt+P（优化速度，特别是在 macOS 上）

- 🎚️ **便捷的目标 IDE 选择**
  - 状态栏小部件 - 点击 IDE 图标选择要跳转到哪个 JetBrains IDE

<div align="center">
  <img src="image/changeTargetIDE.png" alt="更换目标 IDE" width="600"/>
</div>

## 💻 系统要求

- VS Code 1.81.0 或更高版本，或其他支持的编辑器（Cursor、Windsurf、Void、Kiro、Qoder）
- 已安装 JetBrains IDE（IntelliJ IDEA、WebStorm、PyCharm 等）

## 📥 安装

1. 打开 VS Code（或其他支持的编辑器）
2. 转到扩展视图（Ctrl+Shift+X 或 Cmd+Shift+X）
3. 搜索 "EditorJumper"
4. 点击安装按钮

## ⚙️ 配置

1. 点击状态栏上的 IDE 图标
2. 选择"$(gear) Configure EditorJumper"打开配置面板
3. 配置以下选项：
   - 选择默认 JetBrains IDE
   - 添加或编辑 IDE 配置
   - 设置 IDE 命令路径（如需要）

### 配置界面

配置界面允许您：
- 添加新的 IDE 配置
- 编辑现有 IDE 配置
- 隐藏不需要的 IDE
- 选择默认 IDE

对于每个 IDE，您可以配置：
- IDE 名称
- 命令路径（自定义 IDE 需要）
- 是否在选择列表中隐藏

> **配置说明：**
> - macOS：所有 JetBrains IDE 无需额外配置，会自动使用命令行工具
> - Windows：需要配置 IDE 的命令行工具路径
> - Linux：需要配置 IDE 的命令行工具路径
>
> **推荐做法：**
> - 使用 JetBrains Toolbox 管理 IDE，它会自动创建命令行工具
> - 或者在 IDE 中通过 Tools → Create Command-line Launcher 创建

## 🚀 使用方法

### 通过快捷键

| 使用场景 | Shift+Alt+O | Shift+Alt+P（Mac 快速模式）|
|----------|-------------|---------------------------|
| **在项目文件夹上** | 打开项目 | 极速打开项目 |
| **在具体文件上** | 打开项目+文件 | Mac 更快（需先打开项目，否则只会打开文件）,Windows 无差别 |

**使用建议：**
- **Windows 用户**：使用 Shift+Alt+O 即可（满足所有需求）
- **Mac 用户**：使用 Shift+Alt+O，熟悉之后想要更快速的体验用 Shift+Alt+P

### 通过右键菜单

1. 在编辑器或文件资源管理器中右键点击
2. 选择"在 JetBrains IDE 中打开"

### 在状态栏更换跳转目标

1. 点击底部状态栏中的 IDE 图标
2. 从下拉菜单中选择要跳转到的 JetBrains IDE
3. 使用上述任一触发方式执行跳转

## 🔄 配套使用

> 推荐与 [EditorJumper](https://github.com/wanniwa/EditorJumper) 配合使用，以便从 JetBrains IDE 快速返回 VS Code、Cursor、Windsurf、Void、Kiro、Qoder 等编辑器

使用这两个工具可以在您所有喜爱的编辑器之间创建无缝的开发体验。

## 🤝 贡献

欢迎提交 Pull Requests 和 Issues 来帮助改进这个扩展！

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件 

## 常见问题解答

### 问：在 Mac 上使用 EditorJumper 时，跳转到 IntelliJ IDEA 没有反应或出现错误怎么办？

**解决方法：**

1. 打开 IntelliJ IDEA
2. 在菜单栏中选择 `Tools`
3. 点击 `Create Command-line Launcher...`
4. 按照提示完成设置

这样可以确保命令行启动器正确配置，解决跳转问题。

<div align="center">
  <img src="image/macCreateCommand-line.png" alt="macCreateCommand-line" width="600"/>
</div>

### 问：如何添加自定义 IDE？

1. 打开 EditorJumper 配置面板
2. 点击"Add New IDE"按钮
3. 勾选"Custom IDE"
4. 输入 IDE 名称和命令路径
5. 点击保存

### 问：为什么快速模式（Shift+Alt+P）在 Windows 上不起作用？

快速模式是专为 macOS 优化的功能，在 Windows 上会自动降级为标准模式。Windows 用户使用 Shift+Alt+O 即可获得最佳体验。

---