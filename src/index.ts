/**
 * @Author       : Humility
 * @Date         : 2023-07-12 14:04:18
 * @LastEditTime : 2023-07-14 11:42:56
 * @LastEditors  : Humility
 * @FilePath     : \miot-pc-switch-bemfa\src\index.ts
 * @Description  :
 */
import { BemfaMqtt } from "./utils/bemfa-mqtt";
// 配置文件
import { computerList } from "./config/conf.computer";
import { bemfaConf } from "./config/conf.bemfa";

/** mqtt连接 */

const bemfaMqtt = new BemfaMqtt(bemfaConf, computerList);
bemfaMqtt.on("subscribed", (topic) => console.log("subscribed", topic));
bemfaMqtt.on("message", (topic, msg) => console.log(topic, msg));
