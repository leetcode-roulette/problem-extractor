import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import { PopulateProblems } from './db/problems';
import { Database } from './db/db.config';
import healthcheck from './healthcheck';

config();

const serve = async () : Promise<void> => {
    const app: Application = express();

    await Database.connect();

    const PORT = process.env.PORT || 3000;

    app.use("/", healthcheck);

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

    await PopulateProblems.populate();
}

serve();