---
title: "Ruby"
date: 2026-06-01
slug_yuque: mfy6kmuiiat1udqd
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/mfy6kmuiiat1udqd"
source_kind: yuque
---

返回文档数据库相关
功能
命令
解释
连接数据库
psql -h 172.18.0.2 -p 5432 -U mangosteen -d mangosteen_dev
主机名称docker内的
删除表
DROP TABLE <table_name>
创建数据表的映射
bin/rails g model 
user email:string name:string
生成user的表内有email、name字段
同步到数据库
bin/rails db:migrate
数据库操作工具 ActiveRecord::Migration
回滚数据库操作
bin/rails db:rollback step=1
创建数据库
rails db:create RAILS_ENV=test
测试环境创建数据库

MVC操作相关
功能
命令
解释
创建model
bin/rails g model ValidationCode email:string kind:string used_at:datetime
生成model和数据库的映射关系
创建controller
bin/rails g controller user create show
生成/user有create, show方法

单元测试相关
功能
命令
解释
生成RSpec配置文件
rails generate rspec:install

创建测试文件
rails g rspec:model user
user测试文件
执行测试
bundle exec rspec

密钥管理
开发环境
master.key、 credentials.yml.encey
生产环境
production.key、 production.yml.encey
master.key + keys => .enc文件;  .enc文件 + master.key => keys
命令： bin/rails credentials:edit  (--environment production)
开发环境
![](https://cdn.nlark.com/yuque/0/2023/png/158659/1682157374270-b20f6608-be1c-4f2a-9b66-51898181f11c.png)
生产环境
![](https://cdn.nlark.com/yuque/0/2023/png/158659/1682157906916-65c6aadd-b2b0-45ca-825b-9c63c2f74107.png)

编写常见API顺序
1、创建model，运行db:migrate
2、创建controller
3、✍️写单元测试
4、✍️写代码
5、✍️写文档
​若有收获，就点个赞吧