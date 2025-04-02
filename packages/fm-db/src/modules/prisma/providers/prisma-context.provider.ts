import { Injectable, Optional } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

import { PrismaService } from "../services";

export function isTransactionHost(
  context: unknown,
): context is TransactionHost<TransactionalAdapterPrisma> {
  return typeof context === "object" && context !== null && "tx" in context;
}

@Injectable()
export class PrismaContextProvider {
  constructor(
    @Optional()
    private readonly txHost?: TransactionHost<TransactionalAdapterPrisma>,
    @Optional() private readonly prismaService?: PrismaService,
  ) {
    if (!this.txHost && !this.prismaService) {
      throw new Error(
        "Either TransactionHost or PrismaService must be provided",
      );
    }
  }

  getContext() {
    return this.txHost || this.prismaService;
  }
}
