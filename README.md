# Code Docgen

介于 [react-docgen-typescript 插件很久没有更新](https://github.com/cytle/vscode-react-docgen-typescript)，因此借鉴一下，发布属于自己的 TS 文档生成插件。

功能：

## Features

- 一键生成当前文件的类型文档（md）至剪贴板

![docgen](https://github.com/MrSeaWave/vsc-code-docgen/assets/21967852/01c6eae0-eda4-4a45-ac1b-9836936b578e)

可接受配置：
`codeDocgen.tableColumns`

```json
{
  [{title: '属性名', dataIndex: 'identifier',align:'left' | 'right' | 'center'}]
}
```

### TODO

- [ ] 增加生成文档表格配置
- [ ] I18n
- [ ] 增加部署脚本
- [ ] 修复使用 esbuild 打包时 component 组件 props 没生成的问题
- [ ] 规范化 提交记录 & 代码格式 & Github PR、Issues 格式
- [ ] 替换 Eslint Rules
- [x] 等待支持 PNPM 安装包的方式 https://github.com/microsoft/vscode-vsce/issues/421
- [x] 支持动态导入 ES 包 https://github.com/microsoft/vscode/issues/130367
