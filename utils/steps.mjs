import { chalk } from "zx";

let step = 0;

export function printStep(message) {
  console.log(chalk.red.bold(`STEP ${++step}: `), chalk.white.dim(message));
}
