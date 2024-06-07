import dotenv from 'dotenv'
dotenv.config()

interface Config {
    user: string,
    password: string,
    server: string,
    database: string,
    options: {
        encrypt: boolean,
        trustServerCertificate: boolean
    }
    pool: {
        max: number,
        min: number,
        idleTimeoutMillis: number
    }
}

// Export the configurations
export const config: Config = {
    user: process.env.DB_USERNAME as string, 
    password: process.env.DB_PASSWORD as string, 
    server: process.env.DB_SERVER as string, 
    database: process.env.DB_DATABASE as string, 
    pool:{
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false ,
        trustServerCertificate: true
    }
}