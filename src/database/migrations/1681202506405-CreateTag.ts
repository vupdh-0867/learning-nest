import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTag1681202506405 implements MigrationInterface {
  name = 'CreateTag1681202506405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "updated" TIMESTAMP(3) NOT NULL DEFAULT now(), 
        "created" TIMESTAMP(3) NOT NULL DEFAULT now(), 
        "deleted" TIMESTAMP(3), "post_id" uuid NOT NULL, 
        "name" character varying(255) NOT NULL, 
        CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
