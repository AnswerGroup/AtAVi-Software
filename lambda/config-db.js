var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

// table auth
var auth_params = {
    TableName : "auth",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
};

// table auth
var customer_params = {
    TableName : "customer",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
};

// table employee_rules
var employee_rules_params = {
    TableName : "employee_rules",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
};


var customer_rules_params = {
    TableName : "customer_rules",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
};


dynamodb.deleteTable({TableName: "auth"}, function(err, data){
    if (err) {
        dynamodb.createTable(auth_params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table auth");
            }
        });
    } else {
        dynamodb.createTable(auth_params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table auth");
            }
        });
    }
});




dynamodb.deleteTable({TableName: "employee_rules"}, function(err, data){
    if (err) {
        dynamodb.createTable(employee_rules_params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table employee_rules");
            }   
        });
    } else {
        dynamodb.createTable(employee_rules_params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table employee_rules");
            }   
        });

    }
});

dynamodb.deleteTable({TableName: "customer_rules"}, function(err, data){
    if (err) {
        dynamodb.createTable(customer_rules_params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table customer_rules");
            }   
        });
    } else {
        dynamodb.createTable(customer_rules_params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table customer_rules");
            }   
        });

    }
});


dynamodb.deleteTable({TableName: "customer"}, function(err, data){
    if (err) {
        dynamodb.createTable(customer_params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table customer");
            }
        });
    } else {
        dynamodb.createTable(customer_params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table customer");
            }
        });
    }
});
