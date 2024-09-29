import {
  CostExplorerClient,
  GetCostAndUsageCommand,
} from "@aws-sdk/client-cost-explorer";
import { get } from "lodash";
import { GetCostAndUsageCommandOutput } from "@aws-sdk/client-cost-explorer/dist-types/commands";
import axios, { AxiosResponse } from "axios";

export async function main() {
  const TOKEN_ACCESS: string = "your_access_token";
  const CHAT_ID: string = "your_chat_id";
  const client = new CostExplorerClient({ region: "us-east-1" });
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const today_format = `${date.getFullYear()}-${setZero((date.getMonth() + 1).toString())}-${setZero(date.getDate().toString())}`;
  const fist_day_format = `${date.getFullYear()}-${setZero((date.getMonth() + 1).toString())}-01`;

  console.info(`Range [${fist_day_format} to ${today_format}]`);

  const command = new GetCostAndUsageCommand({
    TimePeriod: {
      Start: fist_day_format,
      End: today_format,
    },
    Granularity: "MONTHLY",
    Metrics: ["UnblendedCost"],
  });

  let resp = "";

  try {
    const data: GetCostAndUsageCommandOutput = await client.send(command);
    const amount = get(data, "ResultsByTime[0].Total.UnblendedCost.Amount", 0);
    const currency = get(
      data,
      "ResultsByTime[0].Total.UnblendedCost.Unit",
      "USD",
    );
    resp = `Your actual bill is ${amount} of ${currency}`;
  } catch (error) {
    console.error("Error fetching cost data:", error);
    resp = 'Error fetching cost data:", error';
  }

  const url: string = `https://api.telegram.org/bot${TOKEN_ACCESS}/sendMessage`;
  const params = {
    chat_id: CHAT_ID,
    text: resp,
    parse_mode: "Markdown",
  };

  const telegram_resp = await axios.request({
    method: "post",
    url,
    data: params,
  });

  return {
    body: JSON.stringify({ message: resp }),
    statusCode: telegram_resp.status,
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
    },
  };

  function setZero(value: string): string {
    return value.length === 1 ? `0${value}` : value;
  }
}
