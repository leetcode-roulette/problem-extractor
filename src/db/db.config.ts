import mongoose from "mongoose";
import { logger } from "../logger";

export class Database {
	private static url: string | undefined;

	public static async connect(): Promise<void> {
		try {
			await mongoose.connect(this.connectionString);
			logger.info("Connected to database");
		} catch(e) {
			logger.error("Error connecting to database", e);
			throw e;
		}
	}

	public static disconnect(): void {
		if (!mongoose.connection) {
			return;
		}

		mongoose.disconnect();
		mongoose.connection.close((): void => {
			logger.info("Disconnected from database");
		});
	}

	private static get connectionString(): string {
		this.url = process.env.MONGO_CONNECTION_STRING;

		if (this.url === undefined) {
			throw "MONGO_CONNECTION_STRING can not be found or is not defined";
		}

		return this.url;
	}
}
