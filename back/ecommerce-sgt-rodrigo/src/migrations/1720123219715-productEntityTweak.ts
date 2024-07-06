import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductEntityTweak1720123219715 implements MigrationInterface {
    name = 'ProductEntityTweak1720123219715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "imgUrl" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "imgUrl" SET DEFAULT 'https://res.cloudinary.com/da73rab2q/image/upload/v1716943567/mj1uafvrolxvn6dlenij.jpg'`);
    }

}
