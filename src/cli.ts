#!/usr/bin/env node
import dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  createGoogleFormFromQuiz,
  downloadFormAsQuizFile,
  updateGoogleFormFromQuiz,
} from "./lib/google-forms.js";
import {
  buildTemplateQuizFile,
  readQuizFile,
  writeQuizFile,
} from "./lib/quiz-file.js";

dotenv.config();

async function run(): Promise<void> {
  await yargs(hideBin(process.argv))
    .scriptName("quiz-tool")
    .usage("$0 <command> [options]")
    .command(
      "init-template",
      "Create a starter YAML quiz file.",
      (cmd) =>
        cmd.option("output", {
          alias: "o",
          type: "string",
          demandOption: true,
          describe: "Path to write the template YAML file.",
        }),
      async (argv) => {
        const quiz = buildTemplateQuizFile();
        await writeQuizFile(argv.output, quiz);
        console.log(`Template quiz file created at ${argv.output}`);
      },
    )
    .command(
      "download",
      "Download an existing Google Form quiz into a YAML file.",
      (cmd) =>
        cmd
          .option("form-id", {
            alias: "f",
            type: "string",
            demandOption: true,
            describe: "Google Form ID to download.",
          })
          .option("output", {
            alias: "o",
            type: "string",
            demandOption: true,
            describe: "Path to write the downloaded YAML file.",
          }),
      async (argv) => {
        const quiz = await downloadFormAsQuizFile(argv["form-id"]);
        await writeQuizFile(argv.output, quiz);
        console.log(`Quiz downloaded and saved to ${argv.output}`);
      },
    )
    .command(
      "create",
      "Create a new Google Form quiz from a YAML file.",
      (cmd) =>
        cmd.option("input", {
          alias: "i",
          type: "string",
          demandOption: true,
          describe: "Path to the quiz YAML file.",
        }),
      async (argv) => {
        const quiz = await readQuizFile(argv.input);
        const result = await createGoogleFormFromQuiz(quiz);
        console.log(`Created form ID: ${result.formId}`);
        if (result.responderUri) {
          console.log(`Responder URL: ${result.responderUri}`);
        }
      },
    )
    .command(
      "update",
      "Replace an existing Google Form quiz using a YAML file.",
      (cmd) =>
        cmd
          .option("form-id", {
            alias: "f",
            type: "string",
            demandOption: true,
            describe: "Existing Google Form ID to overwrite.",
          })
          .option("input", {
            alias: "i",
            type: "string",
            demandOption: true,
            describe: "Path to the quiz YAML file.",
          }),
      async (argv) => {
        const quiz = await readQuizFile(argv.input);
        const result = await updateGoogleFormFromQuiz(argv["form-id"], quiz);
        console.log(`Updated form ID: ${result.formId}`);
        if (result.responderUri) {
          console.log(`Responder URL: ${result.responderUri}`);
        }
      },
    )
    .demandCommand(1, "Provide a command. Run with --help for usage.")
    .strict()
    .help()
    .parseAsync();
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
