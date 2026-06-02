---
title: "Ruby"
date: 2022-10-15
tags: ["Ruby"]
---

## 数据库相关

| 功能 | 命令 | 解释 |
|------|------|------|
| 连接数据库 | `psql -h 172.18.0.2 -p 5432 -U mangosteen -d mangosteen_dev` | 主机名称 docker 内的 |
| 删除表 | `DROP TABLE &lt;table_name&gt;` | |
| 创建数据表的映射 | `bin/rails g model user email:string name:string` | 生成 user 的表内有 email、name 字段 |
| 同步到数据库 | `bin/rails db:migrate` | 数据库操作工具 ActiveRecord::Migration |
| 回滚数据库操作 | `bin/rails db:rollback step=1` | |
| 创建数据库 | `rails db:create RAILS_ENV=test` | 测试环境创建数据库 |

## MVC 操作相关

| 功能 | 命令 | 解释 |
|------|------|------|
| 创建 model | `bin/rails g model ValidationCode email:string kind:string used_at:datetime` | 生成 model 和数据库的映射关系 |
| 创建 controller | `bin/rails g controller user create show` | 生成 /user 有 create、show 方法 |

## 密钥管理

`master.key + keys => .enc文件; .enc文件 + master.key => keys`

命令：`bin/rails credentials:edit (--environment production)`

| 环境 | 文件 |
|------|------|
| 开发环境 | `master.key`、`credentials.yml.enc` |
| 生产环境 | `production.key`、`production.yml.enc` |

## 单元测试相关

| 功能 | 命令 |
|------|------|
| 生成 RSpec 配置文件 | `rails generate rspec:install` |
| 创建测试文件 | `rails g rspec:model user` |
| 执行测试 | `bundle exec rspec` |

## 编写常见 API 顺序

1. 创建 model，运行 `db:migrate`
2. 创建 controller
3. 编写单元测试
4. 编写代码
5. 编写文档
