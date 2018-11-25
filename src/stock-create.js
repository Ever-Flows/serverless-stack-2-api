import uuid from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2"
});

export async function main(event, context) {
  //const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Item: {
      User: event.User,
      StockId: uuid.v1(),
      PortfolioName: event.PortfolioName,
      SerialNumber: event.SerialNumber,
      StockSymbol: event.StockSymbol,
      TotalPrice: event.TotalPrice,
      NumberOfShares: event.NumberOfShares,
      PurchaseDate: event.PurchaseDate,
      CreatedAt: Date.now()
    }
  };

  const paramsget = {
    TableName: process.env.tableName,
    KeyConditionExpression: "#usr = :uuu",
    ExpressionAttributeNames:{
      "#usr": "User",
      "#Port": "PortfolioName",
      "#Sno": "SerialNumber"
    },
    FilterExpression: "(#Port =  :pname) AND  (#Sno = :sno)",
    ExpressionAttributeValues: {
      ":uuu": event.User,
      ":pname": event.PortfolioName,
      ":sno": event.SerialNumber
    }
  };

  try {
    const result = await dynamoDbLib.call("query", paramsget);
    if (result.Count>0) {
      // Return the retrieved item
      return success("Portfolio " + event.PortfolioName + "  Serial Number already exists" );
    } else {
      CreatePortfolioStock(params);
    }
  } catch (e) {
    return failure({ status: false });
  }
}  

async function CreatePortfolioStock(params) {
  try {
    const result = await dynamoDbLib.call("put", params);
    return success(result.Item);
  } catch (e) {
    return failure({ status: false });
 }
}
