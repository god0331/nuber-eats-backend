import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { isString } from 'util';
import { CoreEntity } from '../../common/enstities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from './category.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field((type) => String)
  @Column()
  address: string;

  //category가 없어도 restaurant를 생성할 수 있도록 하기 위해
  //nullable을 사용. onDelete는 restaurant가 지워졌을 때 category의 처분을 뜻함.
  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  //모든 restaurant는 owner가 있기 때문에
  //nullable을 하지 않음.ㅈ
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants)
  owner: User;
}
