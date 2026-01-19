const vscode = require('vscode');
const { exec, execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');
const defaultIDEPaths = require('./defaultIDEPaths');
const { ideConfigs } = require('./defaultIDEPaths');
let configPanel;

let statusBarItem;

// 添加Xcode的默认路径
if (!defaultIDEPaths['Xcode']) {
	defaultIDEPaths['Xcode'] = {
		darwin: '/Applications/Xcode.app/Contents/MacOS/Xcode'
	};
}

/**
 * 查找命令的完整路径
 * @param {string} command 命令名称
 * @returns {string} 命令的完整路径，如果找不到则返回原命令
 */
function findCommandPath(command) {
	try {
		// 如果命令已经是绝对路径，直接返回
		if (path.isAbsolute(command) && fs.existsSync(command)) {
			return command;
		}
		
		// 尝试使用which命令查找绝对路径
		if (process.platform === 'darwin' || process.platform === 'linux') {
			try {
				const whichOutput = execSync(`which ${command}`, { encoding: 'utf8' }).trim();
				if (whichOutput && fs.existsSync(whichOutput)) {
					console.log(`Found absolute path for ${command}: ${whichOutput}`);
					return whichOutput;
				}
			} catch (e) {
				// which命令失败，继续使用原始命令
				console.log(`Could not find absolute path for ${command}: ${e.message}`);
			}
		}
		
		// 常见的IDE命令路径
		const commonPaths = [
			'/usr/local/bin',
			'/usr/bin',
			'/opt/homebrew/bin',
			`${os.homedir()}/bin`,
			'/Applications/JetBrains Toolbox',
			`${os.homedir()}/Applications/JetBrains Toolbox`,
			`${os.homedir()}/Library/Application Support/JetBrains/Toolbox/scripts`
		];
		
		// 在每个路径中查找命令
		for (const dir of commonPaths) {
			if (!fs.existsSync(dir)) continue;
			
			const possiblePath = path.join(dir, command);
			if (fs.existsSync(possiblePath)) {
				console.log(`Found command at: ${possiblePath}`);
				return possiblePath;
			}
		}
		
		// 如果找不到，返回原命令
		return command;
	} catch (error) {
		console.error('Error finding command path:', error);
		return command;
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	console.log('Congratulations, your extension "editorjumper" is now active!');

	// 在activate函数中加载configPanel模块，避免循环引用
	configPanel = require('./configPanel');

	const config = vscode.workspace.getConfiguration('editorjumper');
	const currentIDE = config.get('selectedIDE');
	const ideConfigurations = config.get('ideConfigurations');

	if (!currentIDE || !ideConfigurations.find(ide => ide.name === currentIDE)) {
		if (ideConfigurations.length > 0) {
			await config.update('selectedIDE', ideConfigurations[0].name, false);
		}
	}

	// 确保在ideConfigurations中包含Xcode的配置，仅在macOS上
	if (process.platform === 'darwin') {
		const config = vscode.workspace.getConfiguration('editorjumper');
		let ideConfigurations = config.get('ideConfigurations');

		// 如果Xcode配置不存在，则添加
		if (!ideConfigurations.find(ide => ide.name === 'Xcode')) {
			ideConfigurations.push({
				name: 'Xcode',
				commandPath: null, // 设置为null
				isCustom: false,
				hidden: false
			});
			config.update('ideConfigurations', ideConfigurations, true);
		}
	}

	// 创建状态栏项 - 用于选择IDE
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'editorjumper.selectJetBrainsIDE';
	context.subscriptions.push(statusBarItem);

	// 创建配置按钮 - 用于打开配置界面
	// const configButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
	// configButton.text = '$(gear)';
	// configButton.tooltip = 'Configure EditorJumper';
	// configButton.command = 'editorjumper.configureIDE';
	// context.subscriptions.push(configButton);
	// configButton.show();

	updateStatusBar();

	// 注册命令：选择IDE
	let selectIDECommand = vscode.commands.registerCommand('editorjumper.selectJetBrainsIDE', async () => {
		const config = vscode.workspace.getConfiguration('editorjumper');
		const ideConfigurations = config.get('ideConfigurations');
		
		// 创建IDE选项列表
		const items = ideConfigurations
			.filter(ide => !ide.hidden) // 只显示未隐藏的IDE
			.map(ide => ({
				label: ide.name,
				description: ide.isCustom ? '(Custom)' : '',
				name: ide.name
			}));
		
		// 添加配置选项
		items.push({
			label: '$(gear) Configure EditorJumper',
			description: 'Open configuration panel',
			name: 'configure'
		});

		const selected = await vscode.window.showQuickPick(items, {
			placeHolder: 'Select JetBrains IDE or Configure'
		});

		if (selected) {
			if (selected.name === 'configure') {
				// 打开配置界面
				vscode.commands.executeCommand('editorjumper.configureIDE');
			} else {
				// 选择IDE
				await config.update('selectedIDE', selected.name, false);
				updateStatusBar();
			}
		}
	});

	// 注册命令：在JetBrains中打开
	let openInJetBrainsCommand = vscode.commands.registerCommand('editorjumper.openInJetBrains', async (uri) => {
		await openInJetBrainsInternal(uri, false);
	});

	// 注册命令：在JetBrains中打开（快速模式）
	let openInJetBrainsFastCommand = vscode.commands.registerCommand('editorjumper.openInJetBrainsFast', async (uri) => {
		await openInJetBrainsInternal(uri, true);
	});

	/**
	 * 获取IDE配置信息
	 * @param {string} ideName IDE名称
	 * @returns {object|null} IDE配置对象，如果不支持则返回null
	 */
	function getIDEConfig(ideName) {
		return ideConfigs[ideName] || null;
	}

	/**
	 * 获取IDE对应的URL scheme
	 * @param {string} ideName IDE名称
	 * @returns {string|null} URL scheme，如果不支持则返回null
	 */
	function getUrlSchemeForIDE(ideName) {
		const config = getIDEConfig(ideName);
		return config ? config.urlScheme : null;
	}

	/**
	 * 获取IDE在macOS系统中的第一个已安装的应用程序名称
	 * @param {string} ideName IDE名称
	 * @returns {string} macOS应用程序名称
	 */
	function getMacAppNameForIDE(ideName) {
		const config = getIDEConfig(ideName);
		if (config && config.macAppNames && config.macAppNames.length > 0) {
			// 定义常见的应用程序安装路径
			const commonBasePaths = [
				'/Applications',
				`${os.homedir()}/Applications`
			];
			
			// 检查每个应用程序名称，返回第一个已安装的
			for (const appName of config.macAppNames) {
				for (const basePath of commonBasePaths) {
					try {
						// 构建完整的应用程序路径
						const appPath = path.join(basePath, appName);
						// 检查应用程序是否存在
						if (fs.existsSync(appPath)) {
							console.log(`Found installed app at: ${appPath}`);
							// 返回应用程序名称，去掉.app后缀
							return appName.replace('.app', '');
						}
					} catch (error) {
						console.log(`Error checking app ${appName} at ${basePath}:`, error);
					}
				}
			}
			// 如果没有找到已安装的应用，返回第一个应用程序名称（作为降级方案）
			console.log(`No installed app found for ${ideName}, using first option: ${config.macAppNames[0]}`);
			return config.macAppNames[0].replace('.app', '');
		}
		// 对于未知的IDE，返回原名称
		return ideName;
	}

	/**
	 * 检查IDE是否支持快速模式
	 * @param {string} ideName IDE名称
	 * @returns {boolean} 是否支持快速模式
	 */
	function isFastModeSupported(ideName) {
		const config = getIDEConfig(ideName);
		return config ? config.supportsFastMode : false;
	}

	// 内部函数：在JetBrains中打开的实际逻辑
	async function openInJetBrainsInternal(uri, fastMode = false) {
		const config = vscode.workspace.getConfiguration('editorjumper');
		const selectedIDE = config.get('selectedIDE');
		const ideConfigurations = config.get('ideConfigurations');
		const ideConfig = ideConfigurations.find(ide => ide.name === selectedIDE);

		if (!ideConfig) {
			vscode.window.showErrorMessage('Please select a JetBrains IDE first');
			return;
		}

		let filePath;
		let lineNumber = 1;
		let columnNumber = 1;
		const editor = vscode.window.activeTextEditor;

		if (uri) {
			filePath = uri.fsPath;
			if (editor && editor.document.uri.fsPath === filePath) {
				lineNumber = editor.selection.active.line + 1;
				columnNumber = editor.selection.active.character
			}
		} else if (editor) {
			filePath = editor.document.uri.fsPath;
			lineNumber = editor.selection.active.line + 1;
			columnNumber = editor.selection.active.character
		}

		// 获取项目根目录
		let projectPath;

		// 获取当前工作区文件夹
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			// 如果有工作区文件夹，使用第一个工作区文件夹的路径
			projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

			// 如果有多个工作区文件夹，并且有选中的文件，尝试找到包含该文件的工作区文件夹
			if (vscode.workspace.workspaceFolders.length > 1 && filePath) {
				const fileUri = vscode.Uri.file(filePath);
				const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
				if (workspaceFolder) {
					projectPath = workspaceFolder.uri.fsPath;
				}
			}
		} else {
			// 如果没有工作区文件夹，提示用户并返回
			vscode.window.showErrorMessage('No workspace folder is open. Please open a project first.');
			return;
		}

		// 获取命令路径
		let commandPath = '';
		const platform = process.platform;
		// 获取命令路径，优先使用用户配置的路径，否则使用默认路径
		commandPath = ideConfig.commandPath || defaultIDEPaths[ideConfig.name]?.[platform];

		// 如果没有找到命令路径，提示用户配置
		if (!commandPath) {
			const result = await vscode.window.showErrorMessage(
				`Path for ${ideConfig.name} is not configured. Would you like to configure it now?`,
				'Configure', 'Cancel'
			);

			if (result === 'Configure') {
				configPanel.createConfigurationPanel(context);
				// 高亮显示需要配置的IDE
				configPanel.highlightIDE(ideConfig.name);
			}
			return;
		}

		// 判断命令路径是否为文件路径
		const commandPathIsFilePath = commandPath.includes('/') || commandPath.includes('\\');
		const fileExists = commandPathIsFilePath && fs.existsSync(commandPath);
		
		// 如果命令不是绝对路径，尝试查找绝对路径
		if (!commandPathIsFilePath && platform !== 'win32') {
			// 使用findCommandPath函数查找命令的完整路径
			const fullPath = findCommandPath(commandPath);
			if (fullPath !== commandPath) {
				console.log(`Found command path: ${fullPath}`);
				commandPath = fullPath;
			}
		}

		// 执行命令
		executeCommand(commandPath, projectPath, filePath, lineNumber, columnNumber, ideConfig, platform, commandPathIsFilePath, fastMode);
	}

	/**
	 * 统一的命令执行方法
	 */
	function executeCommand(commandPath, projectPath, filePath, lineNumber, columnNumber, ideConfig, platform, commandPathIsFilePath, fastMode) {
		console.log('Executing command with path:', commandPath, 'Fast mode:', fastMode);
		
		try {
			// 判断是否使用快速模式（macOS上的快速模式且IDE支持快速模式）
			const urlScheme = getUrlSchemeForIDE(ideConfig.name);
			const supportsFast = isFastModeSupported(ideConfig.name);
			const useFastMode = fastMode && platform === 'darwin' && supportsFast;
			
			if (fastMode && platform === 'darwin' && !supportsFast) {
				console.log(`IDE "${ideConfig.name}" does not support fast mode, falling back to standard mode`);
			}
			
		if (useFastMode) {
			// macOS快速模式：使用 open -a 命令
			executeFastMode(commandPath, filePath, lineNumber, columnNumber, ideConfig, projectPath, urlScheme);
		} else if (ideConfig.name === 'Xcode' && platform === 'darwin') {
			// Xcode特殊处理
			executeXcodeCommand(projectPath, filePath, lineNumber);
		} else {
			// 标准模式：打开项目+文件
			executeStandardMode(commandPath, projectPath, filePath, lineNumber, columnNumber, ideConfig, platform, commandPathIsFilePath);
		}
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to start IDE process: ${error.message}`);
		}
	}

	/**
	 * 快速模式：macOS 使用 open -a 命令
	 */
	function executeFastMode(commandPath, filePath, lineNumber, columnNumber, ideConfig, projectPath, urlScheme) {
		// 获取macOS系统中的应用程序名称
		const macAppName = getMacAppNameForIDE(ideConfig.name);
		
		// 如果没有指定文件，直接打开项目
		if (!filePath) {
			const fullCommand = `open -a "${macAppName}" "${projectPath}"`;
			console.log('Fast mode command (macOS - project):', fullCommand);
			
			exec(fullCommand, { shell: true }, (error, stdout, stderr) => {
				handleCommandResult(error, stdout, stderr, 'Failed to launch IDE in fast mode');
			});
			return;
		}
		
		// 有指定文件时，使用URL scheme
		// 构建URL：scheme://open?file=path&line=line&column=column
		let fileUrl = `${urlScheme}://open?file=${encodeURIComponent(filePath)}`;
		if (lineNumber > 0) {
			fileUrl += `&line=${lineNumber}`;
			if (columnNumber > 0) {
				fileUrl += `&column=${columnNumber}`;
			}
		}
		
		// 使用open -a命令打开文件
		// 在macOS上使用 'open' 命令而不是直接使用IDE命令可以避免在dock中临时显示两个IDE图标的问题
		const fullCommand = `open -a "${macAppName}" "${fileUrl}"`;
		
		console.log('Fast mode command (macOS - file):', fullCommand);
		
		exec(fullCommand, { shell: true }, (error, stdout, stderr) => {
			handleCommandResult(error, stdout, stderr, 'Failed to launch IDE in fast mode');
		});
	}

	/**
	 * 标准模式：打开项目+文件（JetBrains IDEs）
	 */
	function executeStandardMode(commandPath, projectPath, filePath, lineNumber, columnNumber, ideConfig, platform, commandPathIsFilePath) {
		// 构建文件路径参数部分
		let filePathArgs = '';
		if (filePath) {
			if (lineNumber > 0 || columnNumber > 0) {
				filePathArgs = `--line ${lineNumber} --column ${columnNumber} "${filePath}"`;
			} else {
				filePathArgs = `"${filePath}"`;
			}
		}
		
		executeRegularIDECommand(commandPath, projectPath, filePathArgs, platform, commandPathIsFilePath);
	}

	/**
	 * Xcode特殊处理
	 */
	function executeXcodeCommand(projectPath, filePath, lineNumber) {
		// 检查Xcode是否已经运行
		exec('ps aux | grep -v grep | grep "Xcode.app/Contents/MacOS/Xcode"', (error, stdout, stderr) => {
			const isXcodeRunning = stdout.trim().length > 0;
			const fullCommand = `open -a "Xcode" "${projectPath}"`;
			
			console.log('Opening Xcode project:', fullCommand);
			
			exec(fullCommand, { shell: true }, (error, stdout, stderr) => {
				if (error) {
					handleCommandResult(error, stdout, stderr, 'Failed to launch Xcode');
					return;
				}
				
				// 如果有文件需要打开
				if (filePath) {
					const delay = isXcodeRunning ? 0 : 5000;
					setTimeout(() => {
						const openFileCommand = `xed -l ${lineNumber} "${filePath}"`;
						console.log('Opening file in Xcode:', openFileCommand);
						
						exec(openFileCommand, { shell: true }, (error, stdout, stderr) => {
							handleCommandResult(error, stdout, stderr, 'Failed to open file in Xcode');
						});
					}, delay);
				}
			});
		});
	}

	/**
	 * 常规IDE命令执行
	 */
	function executeRegularIDECommand(commandPath, projectPath, filePathArgs, platform, commandPathIsFilePath) {
		let fullCommand = '';
		
		if (platform === 'win32' && !commandPathIsFilePath) {
			fullCommand = `cmd /c ${commandPath} "${projectPath}" ${filePathArgs}`;
		} else {
			fullCommand = `"${commandPath}" "${projectPath}" ${filePathArgs}`;
		}
		
		console.log('Full command:', fullCommand);
		
		exec(fullCommand, { shell: true }, (error, stdout, stderr) => {
			handleCommandResult(error, stdout, stderr, 'Failed to launch IDE');
		});
	}

	/**
	 * 统一的命令结果处理
	 */
	function handleCommandResult(error, stdout, stderr, errorMessage) {
		if (error) {
			console.error('Command execution error:', error);
			vscode.window.showErrorMessage(`${errorMessage}: ${error.message}`);
			return;
		}
		if (stdout) {
			console.warn('stdout:', stdout);
		}
		if (stderr) {
			console.warn('stderr:', stderr);
		}
	}

	// 注册新的配置命令
	let configureIDECommand = vscode.commands.registerCommand('editorjumper.configureIDE', () => {
		configPanel.createConfigurationPanel(context);
	});

	// 注册更新状态栏命令
	let updateStatusBarCommand = vscode.commands.registerCommand('editorjumper.updateStatusBar', () => {
		updateStatusBar();
	});

	context.subscriptions.push(selectIDECommand);
	context.subscriptions.push(openInJetBrainsCommand);
	context.subscriptions.push(openInJetBrainsFastCommand);
	context.subscriptions.push(configureIDECommand);
	context.subscriptions.push(updateStatusBarCommand);

	// 监听配置变化
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('editorjumper')) {
			updateStatusBar();
		}
	}));

	// 初始显示状态栏
	statusBarItem.show();
}

function updateStatusBar() {
	const config = vscode.workspace.getConfiguration('editorjumper');
	const selectedIDE = config.get('selectedIDE');
	const ideConfigurations = config.get('ideConfigurations');
	const currentIDE = ideConfigurations.find(ide => ide.name === selectedIDE);

	if (currentIDE) {
		statusBarItem.text = `$(link-external) ${currentIDE.name}`;
		statusBarItem.tooltip = `Click to select JetBrains IDE (Current: ${currentIDE.name})`;
	} else {
		statusBarItem.text = '$(link-external) Select IDE';
		statusBarItem.tooltip = 'Click to select JetBrains IDE';
	}
}

// This method is called when your extension is deactivated
function deactivate() {
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}

module.exports = {
	activate,
	deactivate,
	findCommandPath
}
