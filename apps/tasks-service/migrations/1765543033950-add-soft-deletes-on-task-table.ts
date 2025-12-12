import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDeletesOnTaskTable1765543033950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE task ADD deletedAt timestamptz
            ALTER TABLE task ADD isDeleted BOOL;
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE task DROP COLUMN deletedAt
            ALTER TABLE task DROP COLUMN isDeleted;
            `);
  }
}
