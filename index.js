const jwt_decode = require("jwt-decode");

var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

exports.handler = async (event, context, callback) => {

    const { "cognito:username": username } = jwt_decode(event.headers["Authorization"]);

    

    var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
    var uuid = uuidv4();
    var paramsIn = {
        Item: {
            "PlayerId": {
                S: uuid
            },
            "Name":{
                S: username
            },
            "CreateAt":{
                N: Date.now().toString()
            }
        },
        TableName: "LobbyRegistration"
    };
    
    await ddb.putItem(paramsIn).promise();


    const response = {
        statusCode: 200,
        body: JSON.stringify({"id":uuid})
    };
    return response;
};
