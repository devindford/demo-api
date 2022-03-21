const AWS = require('aws-sdk')
const { v4 } = require('uuid')
const https = require("https");
const dynamo = new AWS.DynamoDB.DocumentClient();

// Hash the guid
  const hashString = (str) => {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash)
  }


// Create the database item
  const createDbRecord = async(results, id) => {
    console.log('creating db record')
    // Get the seconds version of the current unix date
    const createdOn = Math.floor(new Date().getTime() / 1000.0)

    const payload = {
      TableName: 'demo.cards.api',
      Item: {
        'user_id': id.toString(),
        'creationTime': createdOn,
        // add 5 minutes to the current unix time in seconds
        'expireIn': createdOn + (5 * 60),
        "cmResponse": JSON.stringify(results)
      }
    }

    try {
      await dynamo.put(payload).promise();
    } catch (e) {
      console.error('Failed to add item to table, Error: ', e)
      return e;
    }

  }

  const sanatizeBody = (str) => {
    if (str) {
    return str.replace(/\s/g, '-').toLowerCase()
    }
  }


  const setCardData = async (event) => {
    // make the request to the API using the https library
    const getRequest = () => {
      // grab our value from the body
      const bodyValue = JSON.parse(event.body).pokemon
      const pokemon = sanatizeBody(bodyValue)
      // set our url to make our query
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`

      // create our new promise to return the API results
      return new Promise((resolve, reject) => {
        const req = https.get(url, res => {
          console.log(`starting request to ${url}`)
          // set our empty variable
          let data = ''

          // combine are data as it comes back from the API
          res.on('data', chunk => {
            data += chunk;
          });

          // once all the data is retrieved, resolve our promise
          res.on('end', () => {
            try {
              console.log('resolving request')
              resolve(JSON.parse((data)))
            } catch (e) {
              reject(console.error('request rejected, Error: ', e))
            }
          })

          res.on('error', e => {
            reject(console.error('request rejected, Error: ', e))
          })
        })
      })

    }

    // hash that value
    const guid = v4()
    const id = hashString(guid)

    try {
      // create the results variable for our return, that will call our function to get the info from the API
      const results = await getRequest();
      // console.log('result is: ➡️ ', results)
      // create the database item
      await createDbRecord(results, id)
      console.log(`Done creating record, record ID: ${id}`)
      console.log(`Record will expire: ${new Date(new Date().getTime() + (5 * 60 *1000))}`)
      const pokemon = JSON.parse(event.body).pokemon


      const response = {
        "statusCode": 200,
        "body": JSON.stringify({
          "requestedPokemon": pokemon,
          "results": results
        }, null, 2),
      }

      console.log(pokemon)

      return response
    } catch (e) {
      return {
        statusCode: 400,
        body: {error: e.message},
      };
    }


  };

module.exports = {
  handler: setCardData
}