import { MigrationInterface, QueryRunner } from "typeorm";

export class SessionRecordTable1735384034041 implements MigrationInterface {
    name = 'SessionRecordTable1735384034041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "zoomMeetingLink" character varying, "notes" text, "transcription" text, "meetingSummary" text, "appointmentId" uuid, CONSTRAINT "PK_cbd2470b7e99f21e06d64b64ad4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_records" ADD CONSTRAINT "FK_26e624cdcfee03c89f2b578953a" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_records" DROP CONSTRAINT "FK_26e624cdcfee03c89f2b578953a"`);
        await queryRunner.query(`DROP TABLE "session_records"`);
    }

}
