/**
 * @Author       : Humility
 * @Date         : 2023-07-12 14:12:46
 * @LastEditTime : 2023-07-13 11:09:58
 * @LastEditors  : Humility
 * @FilePath     : \miot-pc-switch-bemfa\src\config\conf.computer.ts
 * @Description  : 电脑配置
 */

export interface ComputerInfo {
  name: string;
  theme: string;
  ip: string;
  mac: string;
  user: string;
  password: string;
}
export const computerList: Array<ComputerInfo> = [
  {
    name: "谦逊的电脑",
    theme: "HumbleComputer001",
    ip: "192.168.1.111",
    mac: "A8:A1:59:01:33:77",
    user: "Administrator",
    password: "123456",
  },
];
