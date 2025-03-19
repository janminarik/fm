import { Module } from "@nestjs/common";
import { HASH_SERVICE, hashServiceProvider } from "./services";

@Module({
  providers: [hashServiceProvider],
  exports: [HASH_SERVICE],
})
export class CryptoModule {}
