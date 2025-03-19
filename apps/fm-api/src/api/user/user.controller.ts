import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("user")
@Controller({ version: "1", path: "user" })
export class UserController {
  //TODO: delete, updatePhone, updateUserName, updateEmail
}
