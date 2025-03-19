import { BaseEntity } from "./base.entity";

//TODO: domain events

export interface IAggregateRoot {}

export abstract class AggregateRoot extends BaseEntity {}
