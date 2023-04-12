import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1681093533062 implements MigrationInterface {
  name = 'CreateUser1681093533062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "updated" TIMESTAMP(3) NOT NULL DEFAULT now(), 
      "created" TIMESTAMP(3) NOT NULL DEFAULT now(), 
      "deleted" TIMESTAMP(3), 
      "username" character varying(255) NOT NULL, 
      "password" character varying(255) NOT NULL, 
      "email" character varying(255) NOT NULL, 
      CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), 
      CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
      CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_661c2557c3d9c885aa72cdcb74" ON "users" ("username") WHERE deleted IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_661c2557c3d9c885aa72cdcb74"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce4e46ef6eff784ab704dcffe7"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
