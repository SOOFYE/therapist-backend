import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";


export default registerAs('database', (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST.toString(),
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME.toString(),
    password: process.env.DB_PASSWORD.toString(),
    database: process.env.DB_DATABASE.toString(),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: true,
  }));