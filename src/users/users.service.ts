import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { EditProFileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  //check that email does not exist
  //create user
  //동기 비동기에 대한 공부를 해야함. async/await를 사용하면 해당 함수 실행 전에 다음것을 서버 컴퓨터가 실행하지 않음.
  //async/await는 반환을 Promise로 해줘야함.
  async createAccount({
    email,
    password,
    role, //형식 파괴 한 것임.
  }: CreateAccountInput): Promise<[boolean, string?]> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        //throw Error로도 가능함. 단, 에러를 조절하긴 힘듬.
        //에러를 throw하는 것과 return 하는 것의 차이점이 있음. throw 는 스레드를 종료 시켜서 return이 필요없음.
        return [false, 'There is a user with that eamil already'];
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
      return [true];
    } catch (e) {
      return [false, "Couldn't create account"];
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      //email로 user존재 확인.
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      //sign up할때 hash한 비번인데 여기서도 비교할 수 있는 이유는
      //login에서도 같은 해쉬를 해서 못생긴 비번끼리 맞으면 맞는것임.
      //맞네 위에서 불러온 유저의 비번을 확인해서 boolean값을 넣어줌.
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      //중요한 정보를 적기는 좋지 않음. 누구든지 token을 볼 수 있음 =>취약하다.
      //token을 사용하는 이유는 우리의 것인지 진위성을 확인하기 위함이다.
      //즉, 수정을 했는지 그렇지 않은지를 판단하기 위해 사용하는 것이다.
      const token = this.jwtService.sign({ id: user.id });
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ where: { id } });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProFileInput,
  ): Promise<User> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (email) {
      user.email = email;
      user.verified = false; //email은 default 가 false임..
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }

  async verifyEamil(code: string): Promise<boolean> {
    const verification = await this.verifications.findOne({
      where: { code },
      relations: ['user'],
    });
    if (verification) {
      verification.user.verified = true;
      this.users.save(verification.user);
    }

    return false;
  }
}
