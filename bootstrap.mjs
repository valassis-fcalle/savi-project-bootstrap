#!/usr/bin/env zx

import { $, cd, chalk, fs } from "zx";

$.verbose = !!process.env.DEBUG || false;

const PROJECT_FOLDER = "savi-project-bootstrap";

let step = 0;
function printStep() {
  return chalk.red.bold(`STEP ${++step}: `);
}

async function prepare() {
  console.log(printStep(), chalk.white("Preparing ..."));
  await $`rm -rf ./${PROJECT_FOLDER}`;
  fs.mkdirSync(`./${PROJECT_FOLDER}`);

  cd(`./${PROJECT_FOLDER}`);

  await $`npm init -y`;
  await $`git init -b master`;
  await $`git remote add origin git@github.com:valassis-fcalle/savi-project-bootstrap-demo.git`;
  fs.writeFileSync(".gitignore", "node_modules");
}

async function installDependencies() {
  console.log(printStep(), chalk.white("Installing dependencies..."));
  const devDependencies = [
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "@semantic-release/changelog",
    "@semantic-release/git",
    "cspell",
    "eslint-config-airbnb-base@latest",
    "eslint-config-prettier",
    "eslint-plugin-import@^2.25.2",
    "eslint-plugin-markdownlint",
    "eslint-plugin-prettier",
    "eslint@^8.2.0",
    "husky",
    "lint-staged",
    "markdownlint",
    "markdownlint-cli",
    "nodemon",
    "prettier",
    "semantic-release",
  ];
  await $`npm install --save-dev ${devDependencies}`;
}

async function prepareHusky() {
  console.log(printStep(), chalk.white("Setting up semantic-release..."));

  await $`npx --no-install husky install`;
}

async function prepareSpellChecker() {
  console.log(printStep(), chalk.white("Setting up cSpell ..."));
  fs.ensureFileSync("./cspell.json");
  fs.writeJSONSync(
    "./cspell.json",
    {
      ignorePaths: ["node_modules"],
      words: [
        "capi",
        "commitlint",
        "fcalle",
        "imagemin",
        "markdownlint",
        "parens",
        "postcss",
        "savi",
        "stylelint",
        "valassis",
      ],
    },
    { spaces: 2 }
  );
}

async function prepareCommitLint() {
  console.log(printStep(), chalk.white("Setting up commitlint..."));
  fs.ensureFileSync("commitlint.config.js");
  fs.writeFileSync(
    "commitlint.config.js",
    `module.exports = { extends: ['@commitlint/config-conventional'] };`
  );
  fs.ensureFileSync("./.husky/commit-msg");
  fs.writeFileSync(
    "./.husky/commit-msg",
    `#!/bin/sh
. "\$(dirname "\$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
npx --no -- cspell --no-summary --no-progress "\${1}"`
  );
  await $`chmod a+x ./.husky/commit-msg`;
}

async function prepareLinter() {
  console.log(
    chalk.red.bold("STEP 6:"),
    chalk.white("Setting up eslint + airbnb ...")
  );
  fs.ensureFileSync("./.eslintrc.js");
  fs.writeFileSync(
    "./.eslintrc.js",
    `module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  overrides: [
    {
      files: ["*.md"],
      parser: "eslint-plugin-markdownlint/parser",
      extends: ["plugin:markdownlint/recommended"]
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};`
  );
  fs.ensureFileSync("./.eslintignore");
  fs.writeFileSync(
    "./.eslintignore",
    `coverage/*
node_modules/*
build/*
.eslintrc.js
`
  );
}

async function prepareFormatter() {
  console.log(printStep(), chalk.white("Setting up prettier..."));
  fs.ensureFileSync("./.prettierrc");
  fs.writeFileSync(
    "./.prettierrc",
    `{
  "semi": true,
  "trailingComma": "es5",
  "printWidth": 120,
  "singleQuote": true,
  "arrowParens": "always",
  "proseWrap": "preserve"
}
  `
  );
  fs.ensureFileSync("./.prettierignore");
  fs.writeFileSync("./.prettierignore", `node_modules/**`);
}

async function prepareLintStaged() {
  console.log(printStep(), chalk.white("Setting up lint-staged..."));
  fs.ensureFileSync("./.lintstagedrc");
  fs.writeJSONSync(
    "./.lintstagedrc",
    {
      "*": "cspell --no-summary --no-progress",
      "*.md": "markdownlint --fix",
      "*.{js,jsx,ts,tsx,html,css}": ["prettier --write", "eslint --fix"],
      "*.{png,jpeg,jpg,gif,svg}": "imagemin-lint-staged",
      "*.scss": ["postcss --config path/to/your/config --replace", "stylelint"],
    },
    { spaces: 2 }
  );
  fs.ensureFileSync("./.husky/pre-commit");
  fs.writeFileSync(
    "./.husky/pre-commit",
    `#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged`
  );
  await $`chmod a+x ./.husky/pre-commit`;
}

async function prepareSemanticRelease() {
  console.log(printStep(), chalk.white("Setting semantic release ..."));

  fs.writeJSONSync(
    ".releaserc.json",
    {
      branches: ["master"],
      plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        // "@semantic-release/npm",
        // "@semantic-release/git",
      ],
      repositoryUrl:
        "git@github.com:valassis-fcalle/savi-project-bootstrap-demo.git",
    },
    { spaces: 2 }
  );
  await $`npm set-script release "semantic-release"`;
  await $`npm set-script "release:dry" "semantic-release --dry-run"`;
}

await prepare();
await installDependencies();
await prepareHusky();
await prepareSpellChecker();
await prepareCommitLint();
await prepareLinter();
await prepareFormatter();
await prepareLintStaged();
await prepareSemanticRelease();
