---
title: "构建工具 Webpack & Babel"
date: 2021-01-01
tags: ["Webpack", "Babel"]
---

Webpack是一种前端资源构建工具，静态模块打包器(modlue bundler)；在webpack看来前端的所有资源(js/css/img/less/...)都会作为模块处理，根据依赖关系，将它们打包成为对应的静态资源(bundle)
[![image.png](https://cdn.nlark.com/yuque/0/2020/png/158659/1603771210067-3010344f-5d26-4a5d-a730-87783a80bf72.png)](https://www.webpackjs.com/)

## 一、webpack5个核心概念

1、Entry
entry规定entry以哪个文件为入口起点开始打包，分析构建内部依赖图

2、Output
output规定webpack打包以后的资源bundles输出到那里去，以及如何命名

3、Loader
Loader让那个webpack可以去处理一些非js文件(webpack本身只能理解JavaScript)

4、Plugins
plugins可以用于执行范围更广的任务，插件的范围包括从打包优化和压缩到重新定义环境中的变量

5、Mode
production/development

## 二、webpack开发基本配置

webpack.config.js 是 webpack 的配置文件，所有构建工具都是基于 nodejs 平台运行的，模块化默认采用 commonjs

开发环境配置主要让代码运行，考虑方面如下：
- 打包样式资源
- 打包 html 资源
- 打包图片资源
- 打包其他资源
- devServer

```javascript
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引用plugin

module.exports = {
    //入口
    entry: './src/js/index.js',

    // 输出
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'dist'), //__dirname是nodejs的变量，代表当前文件的目录绝对路径
    },

    // loader配置
    module: {
        rules: [
            // 处理css
            {
                test: /\.css$/,  //使用正则来匹配 css 文件
                // 使用那些loader处理
                use: [
                    'style-loader',  //创建style标签，将js中的样式资源进行插入, 添加到head生效
                    'css-loader'     //将css文件变成commonjs模块加载到js，里面内容是样式字符串
                ]
            },
            // 处理less
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },

    // plugins配置
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],

    // 模式
    mode: 'development'
}
```

运行：
webpack 会将打包结果输出出去(dist文件夹)
npx webpack-dev-server 在内存中编译打包，没有输出

loader与plugin不同
loader:  下载、使用(配置loader)
plugin：下载、引入、使用

http://www.woc12138.com/article/45
