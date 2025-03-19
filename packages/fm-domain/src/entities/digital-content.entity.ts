import { AdSpace } from "./ad-space.entity";
import { BaseEntity, ICreateBaseEntityProps } from "./base.entity";
import { AdContentType } from "../enums/ad-space.enum";

export interface ICreateDigitalContent extends ICreateBaseEntityProps {
  type: AdContentType;
  url: string;
  isActive: boolean;
  adSpaceId?: string;
  adSpace?: AdSpace;
}

export class DigitalContent extends BaseEntity {
  constructor({
    id,
    createdAt,
    updatedAt,
    type,
    url,
    isActive,
    adSpaceId,
    adSpace,
  }: ICreateDigitalContent) {
    super({ id, createdAt, updatedAt });
    this._type = type;
    this._url = url;
    this._isActive = isActive;
    this._adSpaceId = adSpaceId || null;
    this._adSpace = adSpace || null;
  }

  private _type: AdContentType;
  private _url: string;
  private _isActive: boolean;
  private _adSpaceId: string | null;
  private _adSpace: AdSpace | null;

  get type(): AdContentType {
    return this._type;
  }

  get url(): string {
    return this._url;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get adSpaceId(): string | null {
    return this._adSpaceId;
  }

  get adSpace(): AdSpace | null {
    return this._adSpace;
  }
}
