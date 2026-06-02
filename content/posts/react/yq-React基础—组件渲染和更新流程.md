---
title: "React基础—组件渲染和更新流程"
date: 2021-01-01
tags: ["浏览器", "渲染", "React"]
---

- JSX如何渲染页面
- setState之后如何更新页面

组件渲染过程
- props state
- render 函数生成 vnode
- patch(elem, vnode)

组件更新过程
- setState(newState) —> dirthComponent(可能有子组件)
- render生成newVnode
- patch(vnode, newVnode)

patch两个阶段
- reconciliation阶段：执行diff算法，JS计算
- commit阶段：将diff结果渲染到dom上
