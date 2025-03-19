import { Injectable, Provider } from "@nestjs/common";
import { compare, genSalt, hash } from "bcryptjs";

export interface IHashService {
  getSalt(length: number): Promise<string>;
  hash(valueString: string, salt?: string): Promise<string>;
  compare(valueString: string, valueHashed: string): Promise<boolean>;
}

//TODO: Argon miesto brcyptjs
@Injectable()
export class HashService implements IHashService {
  async getSalt(length: number): Promise<string> {
    return await genSalt(length);
  }

  async hash(valueString: string, salt?: string): Promise<string> {
    if (salt !== undefined) {
      return await hash(valueString, salt);
    } else {
      return await hash(valueString, await this.getSalt(10));
    }
  }

  async compare(valueString: string, valueHashed: string): Promise<boolean> {
    return await compare(valueString, valueHashed);
  }
}

export const HASH_SERVICE = Symbol("HASH_SERVICE");

export const hashServiceProvider: Provider = {
  provide: HASH_SERVICE,
  useClass: HashService,
};
