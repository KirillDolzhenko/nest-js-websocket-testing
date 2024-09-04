export default () => ({
    port: parseInt(process.env.SERVER_PORT),
    db: {
        port: process.env.DATABASE_URL
    },
    jwt: {
        secret: {
            access: process.env.JWT_SECRET_AUTH,
            refresh: process.env.JWT_SECRET_REFRESH,
        }
    }
});