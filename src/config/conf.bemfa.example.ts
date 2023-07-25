/**
 * @Author       : Humility
 * @Date         : 2023-07-12 15:31:14
 * @LastEditTime : 2023-07-12 15:35:45
 * @LastEditors  : Humility
 * @FilePath     : \miot-pc-switch-bemfa\src\config\bemfa.ts
 * @Description  :
 */

import { BemfaInfo } from "src/lib/bemfa";

export const bemfaConf: BemfaInfo = {
  host: "bemfa.com",
  tcpPort: 8344,
  mqttPort: 9501,
  secretKey: "你巴法云上的私钥",
};
