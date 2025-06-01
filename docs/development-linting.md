# Linting Integration Explained

Formatting and linting is configured using Prettier. The following configurations exist to control linting.

### Prettier configuration file

The [.prettierrc](../.prettierrc) file customizes the configuration in Prettier.

### Prettier ignore file

The [.prettierignore](../.prettierignore) file lists the files and file patterns that will by an Prettier formatting.

### ESLint configuration

The [.eslintrc.js](../.eslintrc.js) file ensures that Prettier formatting is enforced as an ESLint rule.

### Enable auto format in VSCode

To enable automatic formatting in VSCode, go to VSCode's `settings.json` (Ctrl + Shift + P → Preferences: Open Settings JSON) and add these configurations:

```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Auto format on commit

The `lint-staged` action found in [package.json](../package.json) uses Prettier automatically format relevant file types whenever a git commit occurs. The [.husky/pre-commit](../.husky/pre-commit) does the invoking.
