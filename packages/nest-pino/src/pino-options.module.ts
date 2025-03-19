import { Module } from "@nestjs/common";
import { PinoOptionsService } from "./services";

@Module({
  providers: [PinoOptionsService],
  exports: [PinoOptionsService],
})
export class PinoOptionsModule {}
