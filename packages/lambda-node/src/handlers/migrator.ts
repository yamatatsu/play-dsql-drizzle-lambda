import { pushSchema } from "drizzle-kit/api";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as tables from "../db/schema.js";
import { generateDrizzleClient } from "../utils.js";

const dbPromise = generateDrizzleClient();

export const handler = async () => {
	const db = await dbPromise;

	console.log("Running migrations...");

	const start = Date.now();

	const { hasDataLoss, warnings, statementsToExecute, apply } =
		await pushSchema(tables, db);

	console.log({ hasDataLoss, warnings, statementsToExecute });

	await apply();

	// await migrate(db, { migrationsFolder: `${__dirname}/../../drizzle` });

	const end = Date.now();

	console.log(`Migration end: ${end - start}ms`);
};
