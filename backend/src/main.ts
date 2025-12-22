import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app;

export async function createApp() {
    if (!app) {
        const isDev = process.env.NODE_ENV !== 'production';
        app = await NestFactory.create(AppModule, {
            logger: isDev ? ['log', 'error', 'warn', 'debug'] : ['error', 'warn'],
        });

        // Enable CORS
        app.enableCors({
            origin: process.env.FRONTEND_URL || '*',
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: 'Content-Type,Authorization',
        });

        // Global prefix for API routes
        app.setGlobalPrefix('api');
    }
    return app;
}

async function bootstrap() {
    const nestApp = await createApp();
    const port = process.env.PORT || 3001;
    await nestApp.listen(port);
    console.log(`✅ Application is running on: http://localhost:${port}`);
}

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1' && require.main === module) {
    bootstrap().catch((err) => {
        console.error('❌ Failed to start application:', err);
        process.exit(1);
    });
}

export default app;
