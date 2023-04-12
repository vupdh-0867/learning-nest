import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToTitleOnPost1681268714128 implements MigrationInterface {
  name = ' AddIndexToTitleOnPost1681268714128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e21c0487defbb1428a718415ad" ON "posts" ("title") WHERE deleted IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ADD CONSTRAINT "FK_b20aaa37aa83f407ff31c82ded5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tags" DROP CONSTRAINT "FK_b20aaa37aa83f407ff31c82ded5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e21c0487defbb1428a718415ad"`,
    );
  }
}
