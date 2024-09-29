import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class TelegramBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambda
    const telegramBotBilling = new NodejsFunction(this, "telegramBot", {
      entry: "./lambda/index.ts",
      runtime: Runtime.NODEJS_LATEST,
      handler: "main",
      bundling: {
        externalModules: ["aws-sdk"],
        minify: false,
      },
      functionName: "telegramBot",
    });

    // Add role to lambda
    telegramBotBilling.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ce:*"],
        resources: ["*"],
      }),
    );

    // Add cron event
    new Rule(this, "RuleBot", {
      description:
        "Schedule a Lambda that send a notifications every day at 8*00 AM",
      schedule: Schedule.cron({
        year: "*",
        month: "*",
        day: "*",
        hour: "13", // +5 because I am in UTC-5
        minute: "0",
      }),
      targets: [new LambdaFunction(telegramBotBilling)],
    });
  }
}
