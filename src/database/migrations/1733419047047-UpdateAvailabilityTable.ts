import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAvailabilityTable1733419047047 implements MigrationInterface {
    name = 'UpdateAvailabilityTable1733419047047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP COLUMN "isActive"`);
    }

}
