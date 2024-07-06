import { IsString, Length } from "class-validator";
import { Order } from '../../entities_db/order.entity'; 
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
uuidv4();

 
  @Entity({
    name: 'users'
  })
  export class User {
     /**
   * Unique identifier for the user
   * @example 550e8400-e29b-41d4-a716-446655440000
   */
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

     /**
   * Name of the user, must be a string up to 50 characters
   * @example John Doe
   */
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    /**
   * Email of the user, must be a unique string up to 50 characters
   * @example john.doe@example.com
   */
    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    email: string;

    /**
   * Password of the user, must be a string up to 150 characters
   * @example StrongP@ssw0rd!
   */
    @Column({ type: 'varchar', length: 150, nullable: false })
    password: string;

    /**
   * Phone number of the user, stored as an integer
   * @example 1234567890
   */
    @Column()
    phone: string;
  
     /**
   * Country of the user, must be a string up to 50 characters
   * @example United Kingdom
   */
    @Column({ type: 'varchar', length: 50 })
    country: string;


    /**
   * Address of the user, defaults to 'Unknown Address'
   * @example 123 Main St
   */
    @Column({ default: 'Unknown Address' })
    address: string;

     /**
   * City of the user, must be a string up to 50 characters
   * @example Manchester
   */
    @Column({ type: 'varchar', length: 50 })
    city: string;

    /**
   * Indicates if the user is an admin, defaults to false
   * @example false
   */
    @Column({default:false})
    isAdmin:boolean

    /**
   * Orders associated with the user
   */
    //w bear in mind that JoinColumn is not set here so you won't see an orders column
    @OneToMany(() => Order, order => order.user)
    orders: Order[];
  }