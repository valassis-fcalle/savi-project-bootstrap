#!/usr/bin/env zx

import { $, cd, fs } from "zx";
import { PROJECT_FOLDER } from "./utils/env.mjs";
import { printStep } from "./utils/steps.mjs";

cd(PROJECT_FOLDER);

printStep("Installing new dependencies ...");
await $`npm install -D commitlint-plugin-jira-rules commitlint-config-jira`;

printStep("Updating configuration ...");
fs.writeFileSync(
  "commitlint.config.js",
  `module.exports = {
  plugins: ["commitlint-plugin-jira-rules"],
  extends: ["jira"],
};`
);
