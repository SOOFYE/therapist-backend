import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIdColumn1735981051930 implements MigrationInterface {
    name = 'UpdateIdColumn1735981051930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist" DROP CONSTRAINT "FK_9d08fe522840812abd402bbf3e8"`);
        await queryRunner.query(`ALTER TABLE "therapist_services" DROP CONSTRAINT "FK_23aa7f2a2f464c5353110553711"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP CONSTRAINT "FK_b7af54d3323cd673272c95f168e"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_e450b4d7946df3bc8225add4941"`);
        await queryRunner.query(`ALTER TABLE "therapist" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "therapist_services" ADD CONSTRAINT "FK_23aa7f2a2f464c5353110553711" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD CONSTRAINT "FK_b7af54d3323cd673272c95f168e" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_e450b4d7946df3bc8225add4941" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD CONSTRAINT "FK_9d08fe522840812abd402bbf3e8" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist" DROP CONSTRAINT "FK_9d08fe522840812abd402bbf3e8"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_e450b4d7946df3bc8225add4941"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP CONSTRAINT "FK_b7af54d3323cd673272c95f168e"`);
        await queryRunner.query(`ALTER TABLE "therapist_services" DROP CONSTRAINT "FK_23aa7f2a2f464c5353110553711"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_e450b4d7946df3bc8225add4941" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD CONSTRAINT "FK_b7af54d3323cd673272c95f168e" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist_services" ADD CONSTRAINT "FK_23aa7f2a2f464c5353110553711" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD CONSTRAINT "FK_9d08fe522840812abd402bbf3e8" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
