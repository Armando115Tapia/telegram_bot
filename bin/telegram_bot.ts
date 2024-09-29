#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TelegramBotStack } from "../lib/telegram_bot-stack";

const app = new cdk.App();
new TelegramBotStack(app, "TelegramBotStack", {
  analyticsReporting: false,
  crossRegionReferences: false,
  description: "",
  env: { region: "us-east-1" },
  permissionsBoundary: undefined,
  stackName: "telegramBotStack",
  suppressTemplateIndentation: false,
  synthesizer: undefined,
  tags: {},
  terminationProtection: false,
});
