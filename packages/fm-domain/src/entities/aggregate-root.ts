import { BaseEntity } from "./base.entity";

//TODO: domain events

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAggregateRoot {}

export abstract class AggregateRoot extends BaseEntity {}
