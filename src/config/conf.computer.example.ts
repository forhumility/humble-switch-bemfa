/**
 * @Author       : Humility
 * @Date         : 2023-07-12 14:12:46
 * @LastEditTime : 2023-07-13 11:09:58
 * @LastEditors  : Humility
 * @FilePath     : \humble-switch-bemfa\src\config\conf.computer.ts
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
    name: "我的电脑",
    theme: "巴法云的主题",
    ip: "局域网地址",
    mac: "电脑mac地址",
    user: "用户名",
    password: "密码",
  },
];
