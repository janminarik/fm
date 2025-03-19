export type ID = string;

export interface ICreateBaseEntityProps {
  id: ID;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export abstract class BaseEntity {
  constructor({ id, createdAt, updatedAt }: ICreateBaseEntityProps) {
    this._id = id;
    const now = new Date();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
  }

  private _id: ID;
  private _createdAt: Date;
  private _updatedAt: Date | null;

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }
}
