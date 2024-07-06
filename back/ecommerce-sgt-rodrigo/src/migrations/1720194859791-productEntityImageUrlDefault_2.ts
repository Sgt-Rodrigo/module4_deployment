import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductEntityImageUrlDefault21720194859791 implements MigrationInterface {
    name = 'ProductEntityImageUrlDefault21720194859791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imgUrl"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "imgUrl" character varying DEFAULT 'https://res.cloudinary.com/da73rab2q/image/upload/v1716943567/mj1uafvrolxvn6dlenij.jpg'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imgUrl"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "imgUrl" text NOT NULL`);
    }

}
