---
title: "webpack基础用法"
date: 2021-01-01
tags: ["Webpack"]
---

核心概念
Entry
依赖图的入口是entry
JavaScriptRun CodeCopy9912345678910111213// 单入口：entry是一个字符串modules.exports = {	entry: './path/to/my/entry/file.js'}
// 多入口文件：entry是一个对象// 分离应用程序和第三方库(vendor)入口modules.exports = {	entry: {    app: './src/app.js',    vendors: './src/vendors.js'  }}
Output
用来告诉webpack将如何将编译后的文件输出到磁盘
JavaScriptRun CodeCopy991234567891011121314151617181920// 单入口配置module.exports = {    entry: './src/index.js',    output: {        path: path.resolve(__dirname, 'dist'),        filename: 'bundle.js'    }}
// 多入口配置module.exports = {    entry: {        index: './src/index.js',        search: './src/search.js'    },    output: {        path: path.resolve(__dirname, 'dist'),        filename: '[name].js'    }}
Loaders
webpack开箱即用只支持JS和JSON两种数据类型，通过Loaders去支持其他的文件类型并将它们转化为有效的模块，添加到依赖图中

本身是一个函数，接受源文件作为参数，返回转换的结果，常见的loaders如下：

| 名称 | 用途 |
| --- | --- |
| babel-loader | 转换ES6/ES7等JS新特性语法 |
| css-loader | 支持CSS文件的加载和解析 |
| ts-loader | 将TS转化为JS |
| file-loader | 进行文件、字体等打包 |
| raw-loader | 将文件以字符串的形式导入 |
| thread-loader | 多进程打包JS和CSS |

Plugins
插件用于bundle文件的优化，资源管理和环境变量的注入，作用于整个构建过程。

常见的Plugins如下：

| 名称 | 描述 |
| --- | --- |
| CommonsChunkPlugin | 将chunks相同的模块代码提取成公用的JS |
| CleanWebpackPlugin | 清理构建目录 |
| ExtractTextWebpackPlugin | 将css从bundle文件提取成一个独立的css文件 |
| CopyWebpackPlugin | 将文件或者文件夹拷贝到构建的输出目录 |
| HtmlWebpackPlugin | 创建html去承载输出的bundle |
| UglifyjsWebpackPlugin | 压缩JS |
| ZipWebpackPlugin | 将打包资源生成一个zip包 |

Mode
Mode用来指定当前的构建环境是：production、development，设置mode可以使用webpack内置的函数，默认值为production。

| 选项 | 描述 |
| --- | --- |
| development | 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin |
| production | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin. |

解析资源
解析ES6和React JSX
使用babel-loader，babel的配置文件是.babelrc

解析CSS、 Less和Scss
css-loader 用于加载.css文件，并且转换为commonjs对象

style-loader将样式通过<style>标签插入head中

less-loader 将less转换成css

loader是链式调用的，即css-loader -> style-loader
解析文件、字体
一般使用file-loader插件即可

url-loader也可处理图片和字体，可以设置较小资源自动base64

更新策略
文件监听
文件监听是发现源码发生变动的时，自动重新构建出新的输出文件。

webpack开启监听模式，有两种方式
1、启动webpack命令的时候，带上--watch的参数
2、在配置webpack.config.js中设置watch: true
注:  webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。

原理
轮询的去判断文件的最后编辑时间是否发生变化
某个文件发生了变化并不会立刻告诉监听者，而是先缓存起来，等aggregateTimeout

webpack热更新
webpack-dev-server 
1、不刷新浏览器；
2、不输出文件，而是放在内存中；
3、使用HotModuleReplacementPlugin插件

webpack-dev-middleware
将webpack输出的文件创输给服务器，适用于更加灵活的定制场景

原理
Bundle server：提供文件在浏览器访问
HMR Server：将热更新输出的文件传给HMR Runtime

bundle.js：构建输出的文件
HRM Runtime: 会被注入到浏览器，更新文件的变化

文件指纹策略
文件指纹其实指的是打包后的文件名的后缀

文件指纹的生成：
Hash：同整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值就会更改

Chunkhash：和webpack打包的chunk有关，不同的entry会生成不同的chunkhash值

Contenthash：依据文件内容来定义hash，文件内容不变，则contenthash不变

JS文件指纹设置(chunk hash)

CSS文件指纹设置(content hash)

图片文件指纹设置
设置file-loader的name，使用[hash]

文件压缩
HTML、CSS、JS文件的压缩

JS文件的压缩
内置了uglifyjs-webpack-plugin

CSS文件的压缩
使用css-minimizer-webpack-plugin

html文件的压缩
修改html-webpack-plugin，设置压缩参数

清除文件夹
不用每次都去删除dist文件夹，引入插件后每次打包自动清除在重新写入

