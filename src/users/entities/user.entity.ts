import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { object } from 'joi';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from '../../common/enstities/core.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum, IsString, isString } from 'class-validator';

//열거형
enum UserRole {
  client, //0
  owner, //1
  delivery, //2
}

//graphQl
registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  //열거형 사용법
  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  verified: boolean;
  //특정 event 기반한 함수들을 불러주는 데코레이터이다.
  //listeners관련 문서 참고 바람.
  //즉 이 beforeInsert함수는 이렇다. entity가 저장소에 insert되기 전에 처리한다는 뜻이다.
  //entity 관련 데코이므로 entity에 만든다.
  //bcrypt는 hash처리하기에 좋은 모듈이다.
  //create 함수로 instance를 만들면 이 코드가 실행된 후 save함수가 실행된다.
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      //뒤에 10은 10번 hash 처리를 한다는 뜻이다.
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  //beforeinsert를 사용하지 않는 이유는 간단하다. 비교목적이기때문.
  //return이 boolean인 이유는 비교해서 맞다 아니다만 말해주면 되기 때문이다.
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      //this.해당 컬럼은 그값을 불러온다. 그러면 user를 찾고 그 유저에 해당하는 비번을 가져오는 것인가?
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
