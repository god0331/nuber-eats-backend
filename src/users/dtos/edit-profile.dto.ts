import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class EditProFileOutput extends CoreOutput {}

//partialType은 email만 수정할 수도 둘 다 수정할 수 도 있기 때문에 사용한다.
@InputType()
export class EditProFileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}
