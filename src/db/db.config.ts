import mongoose from "mongoose";
import { logger } from "../logger";

export class Database {
	private static url: string | undefined;

	public static async connect(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			mongoose.connect(this.connectionString);

			mongoose.connection.once("open", async (): Promise<void> => {
				logger.info("Connected to database");
				resolve(true);
			});

			mongoose.connection.on("error", async (e): Promise<void> => {
				logger.error("Error connectiong to database", e);
				reject(false);
			});
		});
	}

	public static disconnect(): void {
		if (!mongoose.connection) {
			return;
		}

		mongoose.disconnect();

		mongoose.connection.close(async (): Promise<void> => {
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
