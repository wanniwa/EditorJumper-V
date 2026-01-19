// 默认IDE路径配置
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

// IDE统一配置：包含URL Scheme、App Names等信息
const ideConfigs = {
    'IDEA': {
        urlScheme: 'idea',
        macAppNames: ['IntelliJ IDEA Ultimate.app', 'IntelliJ IDEA.app', 'IntelliJ IDEA CE.app', 'IntelliJ IDEA Community Edition.app'],
        supportsFastMode: true
    },
    'WebStorm': {
        urlScheme: 'webstorm',
        macAppNames: ['WebStorm.app', 'webstorm'],
        supportsFastMode: true
    },
    'PyCharm': {
        urlScheme: 'pycharm',
        macAppNames: ['PyCharm Professional Edition.app', 'PyCharm.app', 'PyCharm CE.app', 'PyCharm Community Edition.app'],
        supportsFastMode: true
    },
    'GoLand': {
        urlScheme: 'goland',
        macAppNames: ['GoLand.app'],
        supportsFastMode: true
    },
    'CLion': {
        urlScheme: 'clion',
        macAppNames: ['CLion.app'],
        supportsFastMode: true
    },
    'PhpStorm': {
        urlScheme: 'phpstorm',
        macAppNames: ['PhpStorm.app'],
        supportsFastMode: true
    },
    'RubyMine': {
        urlScheme: 'rubymine',
        macAppNames: ['RubyMine.app'],
        supportsFastMode: true
    },
    'Rider': {
        urlScheme: 'rider',
        macAppNames: ['Rider.app'],
        supportsFastMode: true
    },
    'Android Studio': {
        urlScheme: 'studio',
        macAppNames: ['Android Studio.app'],
        supportsFastMode: true
    },
    'Xcode': {
        urlScheme: null,
        macAppNames: ['Xcode.app'],
        supportsFastMode: false
    }
};

// 向后兼容：导出ideAppNames
const ideAppNames = {};
Object.keys(ideConfigs).forEach(key => {
    ideAppNames[key] = ideConfigs[key].macAppNames;
});

// 直接返回命令名称，不执行查找
const defaultIDEPaths = {
    'IDEA': {
        darwin: 'idea',
        win32: 'idea',
        linux: 'idea'
    },
    'WebStorm': {
        darwin: 'webstorm',
        win32: 'webstorm',
        linux: 'webstorm'
    },
    'PyCharm': {
        darwin: 'pycharm',
        win32: 'pycharm',
        linux: 'pycharm'
    },
    'GoLand': {
        darwin: 'goland',
        win32: 'goland',
        linux: 'goland'
    },
    'CLion': {
        darwin: 'clion',
        win32: 'clion',
        linux: 'clion'
    },
    'PhpStorm': {
        darwin: 'phpstorm',
        win32: 'phpstorm',
        linux: 'phpstorm'
    },
    'RubyMine': {
        darwin: 'rubymine',
        win32: 'rubymine',
        linux: 'rubymine'
    },
    'Rider': {
        darwin: 'rider',
        win32: 'rider',
        linux: 'rider'
    },
    'Android Studio': {
        darwin: 'studio',
        win32: 'studio',
        linux: 'studio'
    },
    'Xcode': {
        darwin: '/Applications/Xcode.app/Contents/MacOS/Xcode'
    }
};

// 导出统一配置
module.exports = defaultIDEPaths;
module.exports.ideConfigs = ideConfigs;
module.exports.ideAppNames = ideAppNames; 