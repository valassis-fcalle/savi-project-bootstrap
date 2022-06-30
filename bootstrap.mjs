#!/usr/bin/env zx

import { $, cd, fs } from "zx";
import { PROJECT_FOLDER } from "./utils/env.mjs";
import { printStep } from "./utils/steps.mjs";

async function prepare() {
  printStep("Preparing ...");
  await $`rm -rf ./${PROJECT_FOLDER}`;
  fs.mkdirSync(`./${PROJECT_FOLDER}`);

  cd(`./${PROJECT_FOLDER}`);

  await $`npm init -y`;
  await $`git init -b master`;
  await $`git remote add origin git@github.com:valassis-fcalle/savi-project-bootstrap-demo.git`;
  fs.writeFileSync(".gitignore", "node_modules");
}

async function installDependencies() {
  printStep("Installing dependencies...");
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
  printStep("Setting up semantic-release...");
  await $`npx --no-install husky install`;
}

async function prepareSpellChecker() {
  printStep("Setting up cSpell ...");
  fs.ensureFileSync("./cspell.json");
  fs.writeJSONSync(
    "./cspell.json",
    {
      ignorePaths: ["node_modules"],
      words: [
        "capi",
        "commitlint",
        "eudev",
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
  printStep("Setting up commitlint...");
  fs.ensureFileSync("commitlint.config.js");
  fs.writeFileSync(
    "commitlint.config.js",
    `module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['EUDEV-']
    }
  },
  rules: {
    'references-empty': [2, 'never'],
  },
};`
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
  printStep("Setting up eslint + airbnb ...");
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
  printStep("Setting up prettier...");
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
  printStep("Setting up prettier...");
  fs.ensureFileSync("./.lintstagedrc");
  fs.writeJSONSync(
    "./.lintstagedrc",
    {
      "*": "cspell --no-summary --no-progress",
      "*.md": "markdownlint --fix --ignore CHANGELOG.md",
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
  printStep("Setting up semantic release ...");
  fs.writeJSONSync(
    ".releaserc.json",
    {
      ci: false,
      branches: ["master"],
      plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/changelog",
        // "@semantic-release/npm",
        [
          "@semantic-release/git",
          {
            message: "chore(release): ${nextRelease.version}",
          },
        ],
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
