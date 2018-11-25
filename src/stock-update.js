import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      User: event.User,
      StockId: event.pathParameters.id
    },
    UpdateExpression: "SET SerialNumber = :sno, PortFolioName = :pname, StockSymbol = :symb, TotalPrice= :tp, NumberOfShares = :nos , PurchaseDate = :pd" ,
    ExpressionAttributeValues: {
      ":sno": data.SerialNumber || null,
      ":pname": data.PortFolioName || null,
      ":symb": data.StockSymbol || null,
      ":tp": data.TotalPrice || null,
      ":nos": data.NumberOfShares || null,
      ":pd": data.PurchaseDate || null
    },
    ReturnValues: "ALL_NEW"
  };
  console.log(params)
  try {
    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
