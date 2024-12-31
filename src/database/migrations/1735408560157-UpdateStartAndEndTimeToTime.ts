import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStartAndEndTimeToTime1735408560157 implements MigrationInterface {
    name = 'UpdateStartAndEndTimeToTime1735408560157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD "startTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD "endTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "startTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "endTime" TIME NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "endTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "startTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD "endTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD "startTime" character varying NOT NULL`);
    }

}
