import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1765412899970 implements MigrationInterface {
  name = 'Initial1765412899970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" text NOT NULL,
        "description" text NOT NULL,
        "deadline" timestamptz,
        "priority" text NOT NULL,
        "status" text NOT NULL,
        "assignedUsersIds" text[],
        CONSTRAINT "PK_task_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "task_comment" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" text NOT NULL,
        "taskId" uuid NOT NULL,
        "comment" text NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_task_comment_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_comment_task" FOREIGN KEY ("taskId")
          REFERENCES "task"("id")
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TYPE "task_log_action_enum" AS ENUM (
        'CREATED',
        'UPDATED',
        'ARCHIVED',
        'STATUS_CHANGED',
        'PRIORITY_CHANGED',
        'ASSIGNED_USERS_CHANGED'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "task_log" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" text NOT NULL,
        "taskId" uuid NOT NULL,
        "action" "task_log_action_enum" NOT NULL,
        "before" jsonb,
        "after" jsonb,
        "delta" jsonb,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_task_log_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_log_task" FOREIGN KEY ("taskId")
          REFERENCES "task"("id")
          ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_log";`);
    await queryRunner.query(`DROP TYPE "task_log_action_enum";`);
    await queryRunner.query(`DROP TABLE "task_comment";`);
    await queryRunner.query(`DROP TABLE "task";`);
  }
}
