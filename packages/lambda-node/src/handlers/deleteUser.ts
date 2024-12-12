import { usersTable } from "../db/schema.js";
import { generateDrizzleClient } from "../utils.js";

const db = await generateDrizzleClient();
const deleteUsers = db.delete(usersTable).prepare("deleteUsers");

export const handler = async () => {
	console.time("query");
	await deleteUsers.execute();
	console.timeEnd("query");
};
