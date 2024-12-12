import { handler } from "../src/handlers/migrator.js";

handler()
	.then(() => {
		console.log("Migration completed");
		process.exit(0);
	})
	.catch((e) => {
		console.error("Migration failed", e);
		process.exit(1);
	});
