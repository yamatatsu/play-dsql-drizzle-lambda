import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as triggers from "aws-cdk-lib/triggers";

const app = new cdk.App();
const stack = new cdk.Stack(app, "PlayDsqlDrizzleLambda", {
	env: {
		region: "us-east-1",
	},
});

// biome-ignore lint/style/noNonNullAssertion: 書き捨てコードなので
const DSQL_CLUSTER_ID = process.env.DSQL_CLUSTER_ID!;

fn("SelectUser", {
	entry: "../lambda-node/src/handlers/selectUser.ts",
});
fn("CreateUser", {
	entry: "../lambda-node/src/handlers/createUser.ts",
});
fn("DeleteUser", {
	entry: "../lambda-node/src/handlers/deleteUser.ts",
});

new triggers.Trigger(stack, "Trigger", {
	handler: fn("Migrator", {
		entry: "../lambda-node/src/handlers/migrator.ts",
	}),
});

function fn(id: string, props: nodejs.NodejsFunctionProps) {
	return new nodejs.NodejsFunction(stack, id, {
		functionName: `PlayDsql-${id}`,
		architecture: lambda.Architecture.ARM_64,
		...props,
		environment: {
			DSQL_CLUSTER_ID,
			...(props.environment ?? {}),
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
			...(props.initialPolicy ?? []),
		],
	});
}
