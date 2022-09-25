import { Field, ObjectType } from '@nestjs/graphql';

//mutation은 돌연변이라는 뜻으로 에러 처리를 하는데 사용하는 것인가?
@ObjectType()
export class MutationOutput {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok: boolean;
}
