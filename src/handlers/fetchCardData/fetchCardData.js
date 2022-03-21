const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

// Get the database item
const getDbRecord = async(id) => {
  // We only want the one value from the database
  const payload = {
    TableName: 'demo.cards.api',
    Key: {
      "user_id": id,
    },
    ProjectionExpression: "cmResponse",
  }

  try {
    console.log(`Fetching ${id} from the table`)
    return await dynamo.get(payload).promise();
  } catch (e) {
    console.error(`Failed to get item ${id} from the table, Error: `, e)
    return e;
  }

}
const fetchCardData = async (event) => {
  let results = '';
  let statusCode = 200;
  const id = JSON.parse(event.body).id

  try {
    const data = await getDbRecord(id);
    //Parsing JSON data and setting return items
    results = data.Item.cmResponse
  } catch (e) {
    console.error(`Error: `, e)
    statusCode = 400;
    results = e.message;
  }

  return {
    statusCode,
    body: results,
  };
};

module.exports = {
  handler: fetchCardData
}