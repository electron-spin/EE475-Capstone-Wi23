# Electron GUI Demo

## Getting Started
To run this app, you need to install Node.JS (preferably with [nvm](https://github.com/nvm-sh/nvm), as shown).

1. Install nvm: https://github.com/nvm-sh/nvm#installing-and-updating
2. In a terminal, install Node: `nvm install node`
3. In this directory, run `npm install`
4. To start the app, run `npm run start`

Note: the app reads the `test.txt` file in the root directory of this repo, modified by the ML app.

## Packaging the app

1. Choose a platform by editing `forge.config.js` according to these [Electron Forge Docs](https://www.electronforge.io/config/makers).
2. Run `npm run make`
3. Find the executable in the `out/make/` directory.