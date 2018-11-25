
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2"
});
export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    KeyConditionExpression: "#usr = :uuu",
    ExpressionAttributeNames:{
      "#usr": "User",
      "#Port": "PortfolioName"
    },
    FilterExpression: "#Port =  :pname",
    ExpressionAttributeValues: {
      ":uuu": event.User,
      ":pname": event.pathParameters.id
    }
  };
  
  try {
    const result = await dynamoDbLib.call("query", params);
    if (result) {
      // Return the retrieved item
      return success(result);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}

