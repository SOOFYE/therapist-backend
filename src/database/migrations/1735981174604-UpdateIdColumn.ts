import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIdColumn1735981174604 implements MigrationInterface {
    name = 'UpdateIdColumn1735981174604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "therapist" DROP CONSTRAINT "FK_9d08fe522840812abd402bbf3e8"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD CONSTRAINT "FK_9d08fe522840812abd402bbf3e8" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist" DROP CONSTRAINT "FK_9d08fe522840812abd402bbf3e8"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD CONSTRAINT "FK_9d08fe522840812abd402bbf3e8" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
