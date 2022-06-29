import { chalk } from "zx";

let step = 0;

export function printStep() {
  return chalk.red.bold(`STEP ${++step}: `);
}
