import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileNameToPost1681294753912 implements MigrationInterface {
  name = 'AddFileNameToPost1681294753912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "file_name" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "file_name"`);
  }
}
