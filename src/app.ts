import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import healthcheck from './healthcheck';

config();

export const app = (() => {
    const app: Application = express();
    app.use("/", healthcheck);

    return app;
})();