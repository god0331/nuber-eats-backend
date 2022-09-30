import { v4 as uuidv4 } from 'uuid';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CoreEntity } from '../../common/enstities/core.entity';
import { User } from './user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  //joincolumn은 접근하고 싶을 쪽에 필수로 작성한다.
  //예를 들면 user에서 verification 을 부르고 싶다면
  //user에 작성해야한다.
  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
