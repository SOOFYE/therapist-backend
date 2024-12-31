import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTherapistEntities1733330886496 implements MigrationInterface {
    name = 'AddTherapistEntities1733330886496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "therapist_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric NOT NULL, "therapistId" uuid, CONSTRAINT "PK_5dbad116f9d4ca99419749f466c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."therapist_availability_dayofweek_enum" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`);
        await queryRunner.query(`CREATE TABLE "therapist_availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dayOfWeek" "public"."therapist_availability_dayofweek_enum" NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "therapistId" uuid, CONSTRAINT "PK_d95cf4b63c7f341821b19df8add" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "therapist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "preferredLanguages" text NOT NULL, "preferredCurrency" character varying NOT NULL, "timeZone" character varying NOT NULL, "officeLocation" character varying NOT NULL, "workEmail" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_4e9ac749c7bd07e0271f8573b3" UNIQUE ("userId"), CONSTRAINT "PK_9d08fe522840812abd402bbf3e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "therapist_services" ADD CONSTRAINT "FK_23aa7f2a2f464c5353110553711" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" ADD CONSTRAINT "FK_b7af54d3323cd673272c95f168e" FOREIGN KEY ("therapistId") REFERENCES "therapist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist" ADD CONSTRAINT "FK_4e9ac749c7bd07e0271f8573b37" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist" DROP CONSTRAINT "FK_4e9ac749c7bd07e0271f8573b37"`);
        await queryRunner.query(`ALTER TABLE "therapist_availability" DROP CONSTRAINT "FK_b7af54d3323cd673272c95f168e"`);
        await queryRunner.query(`ALTER TABLE "therapist_services" DROP CONSTRAINT "FK_23aa7f2a2f464c5353110553711"`);
        await queryRunner.query(`DROP TABLE "therapist"`);
        await queryRunner.query(`DROP TABLE "therapist_availability"`);
        await queryRunner.query(`DROP TYPE "public"."therapist_availability_dayofweek_enum"`);
        await queryRunner.query(`DROP TABLE "therapist_services"`);
    }

}
