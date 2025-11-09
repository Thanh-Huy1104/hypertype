# Publishing HyperType to VS Code Marketplace

## Prerequisites

1. **Create a Publisher Account**
   - Go to https://marketplace.visualstudio.com/manage
   - Sign in with your Microsoft/GitHub account
   - Create a publisher ID (this will be your `publisher` name in package.json)

2. **Install vsce (Visual Studio Code Extensions CLI)**
   ```bash
   npm install -g @vscode/vsce
   ```

## Before Publishing

1. **Update package.json**
   - Replace `"publisher": "your-publisher-name"` with your actual publisher ID
   - Update `"author"` with your name
   - Update repository URLs with your actual GitHub repository

2. **Create a Personal Access Token**
   - Go to https://dev.azure.com
   - Click on User Settings (top right) → Personal Access Tokens
   - Create a new token with **Marketplace (Manage)** scope
   - Save this token securely - you'll need it for publishing

3. **Test Your Extension**
   ```bash
   npm run compile
   ```
   - Press F5 to test in a new VS Code window
   - Verify all features work as expected

## Publishing Steps

### 1. Package Your Extension

```bash
npm run package
vsce package
```

This creates a `.vsix` file (e.g., `hypertype-0.0.1.vsix`)

### 2. Login to vsce

```bash
vsce login <your-publisher-name>
```

Enter your Personal Access Token when prompted.

### 3. Publish

```bash
vsce publish
```

Or publish a specific version:

```bash
vsce publish minor  # 0.0.1 -> 0.1.0
vsce publish patch  # 0.0.1 -> 0.0.2
vsce publish major  # 0.0.1 -> 1.0.0
```

### 4. Verify

- Check https://marketplace.visualstudio.com/items?itemName=<publisher>.<extension-name>
- Install from marketplace in VS Code to test

## Updating Your Extension

1. Make your changes
2. Update CHANGELOG.md with new changes
3. Run tests: `npm run compile`
4. Publish new version: `vsce publish patch` (or minor/major)

## Tips

- **Icon**: Make sure `media/icons/arrow.png` exists and is a good quality icon (128x128px recommended)
- **Screenshots**: Consider adding screenshots or GIFs to your README for the marketplace listing
- **Keywords**: Good keywords help users find your extension
- **Categories**: Make sure categories in package.json are accurate

## Additional Resources

- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Quick Commands Reference

```bash
# Package (creates .vsix file)
vsce package

# Publish
vsce publish

# Unpublish (careful!)
vsce unpublish <publisher>.<extension-name>

# Show extension info
vsce show <publisher>.<extension-name>
```
