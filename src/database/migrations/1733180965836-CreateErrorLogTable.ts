  import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateErrorLogTable1733180965836 implements MigrationInterface {
    name = 'CreateErrorLogTable1733180965836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "error_logs" ("id" SERIAL NOT NULL, "statusCode" integer NOT NULL, "message" character varying NOT NULL, "error" character varying NOT NULL, "errorDetails" json, "controller" character varying NOT NULL, "method" character varying NOT NULL, "ipAddress" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_6840885d7eb78406fa7d358be72" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "error_logs"`);
    }

}
