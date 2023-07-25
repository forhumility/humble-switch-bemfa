/**
 * @Author       : Humility
 * @Date         : 2023-07-12 14:04:18
 * @LastEditTime : 2023-07-25 11:23:00
 * @LastEditors  : LST-Public
 * @FilePath     : \miot-pc-switch-bemfa\src\index.ts
 * @Description  :
 */
import { BemfaMqtt } from "./utils/bemfa-mqtt";
// 配置文件
import { computerList } from "./config/conf.computer";
import { bemfaConf } from "./config/conf.bemfa";

/** mqtt连接 */

const bemfaMqtt = new BemfaMqtt(bemfaConf, computerList);
bemfaMqtt.init();
bemfaMqtt.computerStatusPolling();
