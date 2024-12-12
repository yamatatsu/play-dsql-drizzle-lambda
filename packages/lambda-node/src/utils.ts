import { DsqlSigner } from "@aws-sdk/dsql-signer";
import { drizzle } from "drizzle-orm/node-postgres";

const DSQL_CLUSTER_ID = process.env.DSQL_CLUSTER_ID;
const AWS_REGION = process.env.AWS_REGION;
const DSQL_ENDPOINT = `${DSQL_CLUSTER_ID}.dsql.${AWS_REGION}.on.aws`;

/**
 * 雑に`admin`で接続する
 * databaseもuserも隠さないストロングスタイルで、とりあえず
 */
export async function generateDrizzleClient() {
	const signer = new DsqlSigner({ hostname: DSQL_ENDPOINT });
	try {
		const token = await signer.getDbConnectAdminAuthToken();

		const db = drizzle({
			connection: {
				host: DSQL_ENDPOINT,
				database: "postgres",
				user: "admin",
				password: token,
				ssl: true,
			},
			// logger: true,
		});

		return db;
	} catch (error) {
		console.error("Failed to generate token: ", error);
		throw error;
	}
}
