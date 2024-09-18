import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodoTable1726646792278 implements MigrationInterface {
  name = 'CreateTodoTable1726646792278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "isCompleted" boolean NOT NULL DEFAULT (0))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "todo"`);
  }
}
