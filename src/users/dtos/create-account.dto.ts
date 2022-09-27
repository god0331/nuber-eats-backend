import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

//pick타입은 객체에서 원하는 칼럼을 가져올 수 있음.
@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

//밑 데코는 graphQl 데코임.
@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
