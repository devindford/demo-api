# POC for a serverless framework cards API

This is a proof of concept to spin up a demo version of how the new cards API could work leveraging the [serverless framework](https://www.serverless.com/framework/docs/getting-started).

## Local Setup

First you will need to install serverless on your machine by running 
```
npm install -g serverless
```
Then run
```
npm install
```

Since this is a demo, this project will be limited, but is more meant to show that we can have this live in code and still function the same. 

Serverless provides some great tips on how a workflow would look if this was set up to consider multiple users in the code base [here](https://www.serverless.com/framework/docs/providers/aws/guide/workflow).

Also if this grew outside of just the PII endpoint, we could break the main serverless file up and house each `functions` section in the corresponding functions folder. 

Each one of those directories would have a README explaining how the function works, the route it's associated with, and what arguments it required.