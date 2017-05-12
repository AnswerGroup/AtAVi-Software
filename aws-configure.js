var exec = require('child_process').exec;


//
// Il file contiene una serie di comandi per configurare le impostazioni inziali di AWS
// il file si lancia con "node aws-configure.js"
// è necessario copiare l'arn del ruolo e di SNS per incollarlo nei file necessari
// 
// le parti commentate di questo file permettono di eseguire facilmente ulteriori comandi se si volesse estendere
// il processo di installazione
// 


const createApi() = "aws apigateway import-rest-api --body 'file://API.json' --region eu-west-1"
/*
const commands = {  
    "comando1": "aws comando personalizzato"
};
*/

const tables = {
    "command_CreateTable_Auth": "aws dynamodb create-table --table-name auth --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5",
    "command_CreateTable_Curiosities": "aws dynamodb create-table --table-name curiosities --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5",
    "command_CreateTable_Customer": "aws dynamodb create-table --table-name customer --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5",
    "command_CreateTable_CustomerRules": "aws dynamodb create-table --table-name customer_rules --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5",
    "command_CreateTable_EmployeeRules":"aws dynamodb create-table --table-name employee_rules --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5"
};

const command_CreateRole = "aws iam create-role --role-name invoke_lambda --assume-role-policy-document file://filepolicy.json";
const command_CreateSNSTopic = "aws sns create-topic --name sendSlackMessage";

const policies = {
    "command_AttachPolicy_PolicyAmazonDynamoDBFullAccess": "aws iam attach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
    "command_AttachPolicy_AWSLambdaExecute": "aws iam attach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/AWSLambdaExecute",
    "command_AttachPolicy_AWSLambdaBasicExecutionRole": "aws iam attach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "command_AttachPolicy_AWSLambdaInvocation-DynamoDB": "aws iam attach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/AWSLambdaInvocation-DynamoDB",
    "command_AttachPolicy_AmazonSNSFullAccess": "aws iam attach-role-policy --role-name invoke_lambda --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess"
};



function process(key, value) {
    exec(value, function(err, stdout, stderr){
        if (err) {
            console.log("[-] There was an error while executing " + key);
        } else {
            console.log("[+] Executed " +  key + " successfully");
        }
    });
}

function createRole() {
    exec(command_CreateRole + "| grep arn", function(err, stdout, stderr){
        if (err) {
            console.log("[-] There was an error while executing " + "command_CreateRole");
        } else {
            stdout = stdout.split('"')
            console.log("[+] Executed " +  "command_CreateRole" + " successfully");
            console.log('======================================================');
            console.log('');
            console.log("[=] Role ARN =====> ", stdout[3]); //ARN is here
            console.log('');
            console.log('======================================================');
            attachPolicies();
        }
    });
}

function createSNSTopic() {
    exec(command_CreateSNSTopic + "| grep arn", function(err, stdout, stderr){
        if (err) {
            console.log("[-] There was an error while executing " + "command_CreateSNSTopic");
        } else {
            stdout = stdout.split('"')
            console.log("[+] Executed " +  "command_CreateSNSTopic" + " successfully");
            console.log('======================================================');
            console.log('');
            console.log("[=] SNS ARN =====> ", stdout[3]);
            console.log('');
            console.log('======================================================');
        }
    });
}

function attachPolicies() {
    for (var policy in policies){
        process(policy, policies[policy])
    }
}

function createTables() {
    for (var table in tables){
        process(table, tables[table]);
    }
};

/*
function otherCommands() {
    for (var command in commands){
        process(command, commands[command]);
    }
};
*/

createSNSTopic();
createApi();
createRole();
createTables();
//otherCommands();
