import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIds1735759511572 implements MigrationInterface {
    name = 'UpdateIds1735759511572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist_services" DROP CONSTRAINT "FK_23aa7f2a2f464c5353110553711"`);
        await queryRunner.query(`ALTER TABLE "therapist_services" DROP COLUMN "therapistId"`);
        await queryRunner.query(`ALTER TABLE "therapist_services" ADD "therapistId" uuid`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP CONSTRAINT "FK_b7af54d3323cd673272c95f168e"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP COLUMN "therapistId"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD "therapistId" uuid`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_e450b4d7946df3bc8225add4941"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "therapistId"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "therapistId" uuid`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "clientId" uuid`);
        await queryRunner.query(`ALTER TABLE "therapist" DROP CONSTRAINT "PK_9d08fe522840812abd402bbf3e8"`);
        await queryRunner.query(`ALTER TABLE "therapist" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD CONSTRAINT "PK_9d08fe522840812abd402bbf3e8" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "therapist_services" ADD CONSTRAINT "FK_23aa7f2a2f464c5353110553711" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD CONSTRAINT "FK_b7af54d3323cd673272c95f168e" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_e450b4d7946df3bc8225add4941" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD CONSTRAINT "FK_9d08fe522840812abd402bbf3e8" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist" DROP CONSTRAINT "FK_9d08fe522840812abd402bbf3e8"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_e450b4d7946df3bc8225add4941"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_f1ab7cf3a5714dbc6bb4e1c28a4"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP CONSTRAINT "FK_b7af54d3323cd673272c95f168e"`);
        await queryRunner.query(`ALTER TABLE "therapist_services" DROP CONSTRAINT "FK_23aa7f2a2f464c5353110553711"`);
        await queryRunner.query(`ALTER TABLE "therapist" DROP CONSTRAINT "PK_9d08fe522840812abd402bbf3e8"`);
        await queryRunner.query(`ALTER TABLE "therapist" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD CONSTRAINT "PK_9d08fe522840812abd402bbf3e8" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "clientId" character varying`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "therapistId"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "therapistId" character varying`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_e450b4d7946df3bc8225add4941" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP COLUMN "therapistId"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD "therapistId" character varying`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD CONSTRAINT "FK_b7af54d3323cd673272c95f168e" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist_services" DROP COLUMN "therapistId"`);
        await queryRunner.query(`ALTER TABLE "therapist_services" ADD "therapistId" character varying`);
        await queryRunner.query(`ALTER TABLE "therapist_services" ADD CONSTRAINT "FK_23aa7f2a2f464c5353110553711" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
