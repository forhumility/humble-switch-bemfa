/**
 * @Author       : Humility
 * @Date         : 2023-07-13 09:30:53
 * @LastEditTime : 2023-07-13 10:17:16
 * @LastEditors  : Humility
 * @FilePath     : \miot-pc-switch-bemfa\src\lib\switch.ts
 * @Description  : 开关
 */
import { BemfaDevice } from "./bemfa";
export class Switch extends BemfaDevice {
  constructor(ctx) {
    super(ctx);
  }
  /**
   * 打开设备
   */
  turnOn(): void {}
  /**
   * 关闭设备
   */
  turnOff(): void {}
}
