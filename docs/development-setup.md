# Development Setup

This document provides information setting up an environment, tools, and configurations for local development. The instructions are specific to a macOS environment.

### Table of Contents

- [Required Software](#required-software)
- [About](#about)
- [Install Homebrew](#install-homebrew)
- [Install Node.js](#install-nodejs)
- [Install pnpm](#install-pnpm)

## Required Software

- [Homebrew](https://brew.sh/) - Package manager for macOS.
- [Node.js](https://nodejs.org/en) - Javascript runtime environment.
- [pnpm](https://pnpm.io/) - Package manager.

## About

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Install Homebrew

Homebrew is a package manager for macOS. Go to the [Homebrew](https://brew.sh/) website for information on its installation.

## Install `fnm`, a node version manager

```shell
brew install fnm
```

## Configure your shell to use `fnm`

#### Add fnm to your ~/.zshrc

```
eval "$(fnm env --use-on-cd)"
```

Note: The `--use-on-cd` will allow fnm to automatically activate the right Node version whenever you `cd` into a project directory.

#### Reload your shell

```shell
source ~/.zshrc
```

#### Install Node via fnm

```shell
fnm install 24.19.0
```

## Create `.node-version` file

```shell
echo "24.19.0" > .node-version
```

## Install pnpm

Next.js recommends using pnpm as the package manager because it is faster and more efficient than npm or yarn. The instructions below use Corepack (which is integrated into Node 24+) to install pnpm.

```shell
corepack enable
corepack prepare pnpm@11.22.0 --activate
```

## Local environment file setup

In the root directory, create a file called `.env.local` if it does not exist. This file will contain environment properties needed to run the application.

Add the API base URL to the backend serving the API.

```text
NEXT_PUBLIC_GYMROSTER_API_BASE_URL="http://localhost:8080"
```
