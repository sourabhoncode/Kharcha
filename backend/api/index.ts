import { createServer } from 'http';
import { app } from './main';

const server = createServer(app.getHttpServer());

export default server;
