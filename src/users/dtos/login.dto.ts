import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

//mutationoutput에서 object처리를 해도 여기서도 다시 해야함.
@ObjectType()
export class LoginOutput extends MutationOutput {
  @Field((type) => String, { nullable: true })
  token?: string;
}
