export default () => ({

    port: parseInt(process.env.SERVER_PORT),
    ip: process.env.SERVER_IP,
    corsUrl: process.env.CORS_URL,
    apiPath: process.env.API_DIR,
    db: {
        port: process.env.DATABASE_URL,
    },
    jwt: {
        secret: {
            access: process.env.JWT_SECRET_AUTH,
            refresh: process.env.JWT_SECRET_REFRESH,
        }
    }
});