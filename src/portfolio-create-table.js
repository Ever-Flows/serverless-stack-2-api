var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2"
  //endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "portfolio-dev",
    KeySchema: [       
        { AttributeName: "User", KeyType: "HASH"},  //Partition key
        { AttributeName: "StockId", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "User", AttributeType: "S" },
        { AttributeName: "StockId", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
