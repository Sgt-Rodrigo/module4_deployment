import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  
import { OrderDetail } from './order_detail.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/users/user.entity';
uuidv4();
  
  @Entity({
    name: 'orders'
  })
  export class Order {
    /**
   * Unique identifier for the order, generated as a UUID
   * @example 550e8400-e29b-41d4-a716-446655440000
   */
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    /**
   * User associated with the order
   * @example {
   *  "id": "550e8400-e29b-41d4-a716-446655440000",
   *  "name": "John Doe",
   *  "email": "john.doe@example.com"
   * }
   */
  //w many order for one user
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User; 
  
    /**
   * Date of the order
   * @example 2024-05-30T14:48:00.000Z
   */
    @Column()
    date: Date;
    
    /**
   * Order detail associated with the order, excluded from serialization
   */
    @Exclude()
    @OneToOne(() => OrderDetail, orderDetail=> orderDetail.order)
    @JoinColumn()
    orderDetail: OrderDetail;

    /**
   * Total amount of the order, stored as a decimal with precision 10 and scale 2
   * @example 199.99
   */
    @Column('decimal', { precision: 10, scale: 2 })
    total: number;
  }
  