# POC for a serverless framework cards API

This is a proof of concept to spin up a demo version of how the new cards API could work leveraging the [serverless framework](https://www.serverless.com/framework/docs/getting-started).

Since this is a demo, this project will be limited, but is more meant to show that we can have this live in code and still function the same. 

Serverless provides some great tips on how a workflow would look if this was set up to consider multiple users in the code base [here](https://www.serverless.com/framework/docs/providers/aws/guide/workflow).

Also if this grew outside of just the PII endpoint, we could break the main serverless file up and house each `functions` section in the corresponding functions folder. 

Each one of those directories would have a README explaining how the function works, the route it's associated with, and what arguments it required.

## Local development

Local development is limited, but not fully, there is a way to leverage docker to mock some things with serverless framework plugin. You can see it at work in this [example](https://github.com/serverless/examples/tree/v3/aws-node-rest-api-with-dynamodb-and-offline) provided by serverless.

### Required install

```
npm install -g serverless
```

### Deploying

If we needed to deploy the entire stack we would run

```
serverless deploy --verbose
```

The above prints all the actions as they happen in the CLI, or the builtin npm command that runs the same as above
```
npm run deploy
```

If you were working in a specific function and didn't want to deploy the entire stack each time when just working in the one file, you could run

```
sls deploy -f <your-function-name>
```

This helps speed up the process since most of the time alterations wouldn't be happening to the deployment as a whole, but a single function.

There is a host of other commands, and most likely we would have different stages such as `dev`, `staging`, and `production`, which would be appended into the above commands.

There is also differnt ways to write tests for the serverless application, more details on testing can be found [here](https://www.serverless.com/framework/docs/guides/testing).