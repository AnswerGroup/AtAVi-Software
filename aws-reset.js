var exec = require('child_process').exec;

// 
// Il file si occupa di effettuare il processo inverso di aws-configure.js
// resetta lo stato della console di aws
// nei due comandi qui soto è necessario sostituire "[YOUR_SNS_ARN]" e "[YOUR_API_ID]"
// con i dati corretti
// E' possibile trovare tali dati sulla console di Amazon
// 

const commands = {
    "command_DeleteSNSTopic": "aws sns delete-topic --topic-arn [YOUR_SNS_ARN]",
    "command_DeleteAPI": "aws apigateway delete-rest-api --rest-api-id [YOUR_API_ID] --region eu-west-1"
}

const command_DeleteRole = "aws iam delete-role --role-name invoke_lambda";

const policies = {
    "command_DetachPolicy_AmazonSNSFullAccess": "aws iam detach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess",
    "command_DetachPolicy_AmazonDynamoDBFullAccess": "aws iam detach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
    "command_DetachPolicy_AWSLambdaExecute": "aws iam detach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/AWSLambdaExecute",
    "command_DetachPolicy_AWSLambdaBasicExecutionRole": "aws iam detach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "command_DetachPolicy_AWSLambdaInvocation-DynamoDB": "aws iam detach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/AWSLambdaInvocation-DynamoDB"
}

const tables = {
    "command_DeleteTableAuth": "aws dynamodb delete-table --table-name auth",
    "command_DeleteTableCuriosities": "aws dynamodb delete-table --table-name curiosities",
    "command_DeleteTableCustomer": "aws dynamodb delete-table --table-name customer",
    "command_DeleteTableCustomerRules": "aws dynamodb delete-table --table-name customer_rules",
    "command_DeleteTableEmployeeRules": "aws dynamodb delete-table --table-name employee_rules"
}

function process(key, value, callback) {
    exec(value, function(err, stdout, stderr){
        if (err) {
            console.log("[-] There was an error while executing " + key);
            //console.log(err)
        } else {
            console.log("[+] Executed " +  key + " successfully");
        }
        if (callback)
        callback();
    });
}

function deleteRole() {
    exec(command_DeleteRole, function(err, stdout, stderr){
        if (err) {
            console.log("[-] There was an error while executing " + "command_DeleteRole");
        } else {
            console.log("[+] Executed " +  "command_DeleteRole" + " successfully");
        }
    });
}


function detachPolicies(callback) {
    var n = 0;
    for (var policy in policies){
        process(policy, policies[policy], function() {
            n++;
            if (n === 4) { // 4 = comandi da eseguire prima di cancellare il ruolo
                callback();
            }
        })
    }
}

function deleteTables() {
    for (var table in tables){
        process(table, tables[table]);
    }
};

function otherCommands() {
    for (var command in commands){
        process(command, commands[command]);
    }
};

detachPolicies(deleteRole);
deleteTables();
otherCommands();
 