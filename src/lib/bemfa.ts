/**
 * @Author       : Humility
 * @Date         : 2023-07-13 09:41:45
 * @LastEditTime : 2023-07-14 11:39:10
 * @LastEditors  : Humility
 * @FilePath     : \miot-pc-switch-bemfa\src\lib\bemfa.ts
 * @Description  :
 */
export interface BemfaInfo {
  host: string;
  tcpPort: number;
  mqttPort: number;
  secretKey: string;
}

export enum DeviceStatus {
  "off",
  "on",
  "unknown",
}

export interface IStatusObserver {
  statusChanged(value: DeviceStatus, device?: BemfaDevice): void;
}
export abstract class BemfaDevice {
  name?: string;
  theme: string;
  statusObs: Array<IStatusObserver> = new Array<IStatusObserver>(); // 状态的监听者们
  private _status?: DeviceStatus;
  get status(): DeviceStatus | undefined {
    return this._status || DeviceStatus.unknown;
  }
  set status(value: DeviceStatus | undefined) {
    this._status = value || DeviceStatus.unknown;
    for (let ob of this.statusObs) {
      ob.statusChanged(this._status, this);
    }
  }
  constructor(theme) {
    this.theme = theme;
  }
  abstract turnOn(): void;
  abstract turnOff(): void;
}
