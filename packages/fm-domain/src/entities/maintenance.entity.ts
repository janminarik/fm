import { AdSpace } from "./ad-space.entity";
import { BaseEntity, ICreateBaseEntityProps } from "./base.entity";

export interface ICreateMaintenance extends ICreateBaseEntityProps {
  description: string;
  adSpaceId: string;
  adSpace: AdSpace;
}

export class Maintenance extends BaseEntity {
  constructor({
    id,
    createdAt,
    updatedAt,
    description,
    adSpaceId,
    adSpace,
  }: ICreateMaintenance) {
    super({ id, createdAt, updatedAt });
    this._description = description;
    this._adSpaceId = adSpaceId;
    this._adSpace = adSpace;
  }

  private _description: string;
  private _adSpaceId: string;
  private _adSpace: AdSpace;

  get description(): string {
    return this._description;
  }

  //TODO: DDD by malo by ID alebo entita nested
  get adSpaceId(): string {
    return this.adSpaceId;
  }

  get adSpace(): AdSpace {
    return this.adSpace;
  }
}
