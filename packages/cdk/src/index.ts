import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";

const app = new cdk.App();
const stack = new cdk.Stack(app, "PlayDsqlDrizzleLambda", {
	env: {
		region: "us-east-1",
	},
});

// biome-ignore lint/style/noNonNullAssertion: 書き捨てコードなので
const DSQL_CLUSTER_ID = process.env.DSQL_CLUSTER_ID!;

new nodejs.NodejsFunction(stack, "Function", {
	entry: "../lambda-node/src/index.ts",
	runtime: lambda.Runtime.NODEJS_LATEST,
	environment: {
		DSQL_CLUSTER_ID,
	},
	initialPolicy: [
		new iam.PolicyStatement({
			actions: ["dsql:DbConnectAdmin"],
			resources: [
				stack.formatArn({
					service: "dsql",
					resource: "cluster",
					resourceName: DSQL_CLUSTER_ID,
				}),
			],
		}),
	],
});
