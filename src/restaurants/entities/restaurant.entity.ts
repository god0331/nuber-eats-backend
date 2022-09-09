import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { isString } from 'util';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => Boolean, { defaultValue: true })
  @Column({ default: true })
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  ownersName: string;

  @Field((type) => String)
  @Column()
  categoryName: string;
}
