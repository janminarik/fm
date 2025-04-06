import { Injectable } from "@nestjs/common";

import { ActionSequenceExecutor } from "./core/action-sequence-executor";

@Injectable()
export class MapyScraperService {
  constructor(private readonly executor: ActionSequenceExecutor) {}
}
