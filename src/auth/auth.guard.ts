import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

//canactivate는 true를 return하면 request를 진행시키고 false면 request를 멈춘다.
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}
//authentication는 누가 자원을 요청하는지 확인하는 작업임. token으로 identity를 확인하는 작업
//authorization은 user가 어떤 일을 하기 전에 psermission을 가지고 있는지 확인하는 과정이다.
