import "dotenv/config";
import { DsqlSigner } from "@aws-sdk/dsql-signer";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./db/schema";

const DSQL_CLUSTER_ID = process.env.DSQL_CLUSTER_ID;
const AWS_REGION = process.env.AWS_REGION;
const DSQL_ENDPOINT = `${DSQL_CLUSTER_ID}.dsql.${AWS_REGION}.on.aws`;

const generateDrizzleClientPromise = generateDrizzleClient();

export const handler = async () => {
	const db = await generateDrizzleClientPromise;

	const users = [
		{
			id: "979d1120-db93-4c5e-b631-36f00fd46607",
			name: "John Doe",
			age: 30,
			email: "foo@example.com",
		},
		{
			id: "b35efca4-e902-4531-aad2-97d86e553582",
			name: "Jane Doe",
			age: 25,
			email: "bar@example.com",
		},
		{
			id: "b10c2fd5-be46-4b15-bd50-2043dcd394b3",
			name: "Alice",
			age: 20,
			email: "buz@example.com",
		},
	] satisfies (typeof usersTable.$inferInsert)[];

	for (const user of users) {
		console.time("Inserting a user");
		await db.insert(usersTable).values(user).onConflictDoUpdate({
			target: usersTable.id,
			set: user,
		});
		console.timeEnd("Inserting a user");
	}

	console.time("Selecting all users");
	const selected = await db.select().from(usersTable);
	console.timeEnd("Selecting all users");

	return {
		users,
	};
};

// libs

/**
 * 雑に`admin`で接続する
 * databaseもuserも隠さないストロングスタイルで、とりあえず
 */
async function generateDrizzleClient() {
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
		});

		return db;
	} catch (error) {
		console.error("Failed to generate token: ", error);
		throw error;
	}
}
