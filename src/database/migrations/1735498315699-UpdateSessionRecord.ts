import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSessionRecord1735498315699 implements MigrationInterface {
    name = 'UpdateSessionRecord1735498315699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_records" ADD "meetingId" character varying`);
        await queryRunner.query(`ALTER TABLE "session_records" ADD "sessionAudioUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "session_records" ADD "transcriptionUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_records" DROP COLUMN "transcriptionUrl"`);
        await queryRunner.query(`ALTER TABLE "session_records" DROP COLUMN "sessionAudioUrl"`);
        await queryRunner.query(`ALTER TABLE "session_records" DROP COLUMN "meetingId"`);
    }

}
