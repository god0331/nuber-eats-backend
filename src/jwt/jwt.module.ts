import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constant';
import { JwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({})
@Global() //수동으로 불러오지 않아도 됨.
export class JwtModule {
  //또다른 module을 반환해주는 모듈
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule, //모듈이름
      exports: [JwtService], //서비스 수출
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
    };
  }
}
