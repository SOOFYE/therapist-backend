import { MigrationInterface, QueryRunner } from "typeorm";

export class SessionRecordStatus1736611863649 implements MigrationInterface {
    name = 'SessionRecordStatus1736611863649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."session_records_status_enum" AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')`);
        await queryRunner.query(`ALTER TABLE "session_records" ADD "status" "public"."session_records_status_enum" NOT NULL DEFAULT 'SCHEDULED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_records" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."session_records_status_enum"`);
    }

}
