/**
 * @Author       : Humility
 * @Date         : 2023-07-13 16:33:00
 * @LastEditTime : 2023-07-13 16:37:11
 * @LastEditors  : Humility
 * @FilePath     : \miot-pc-switch-bemfa\src\utils\bemfa-tcp.ts
 * @Description  :
 */
import { Socket } from "net";
import { bemfaConf } from "src/config/conf.bemfa";
import { computerList } from "src/config/conf.computer";

const { host, tcpPort, secretKey } = bemfaConf;
/** tcp连接 */
const socketClient = new Socket();
socketClient.connect({ host, port: tcpPort });
socketClient.on("connect", () => {
  console.log("server connected");
  computerList.forEach((computer) => {
    const { theme } = computer;
    socketClient.write(`cmd=1&uid=${secretKey}&topic=${theme}\r\n`);
  });
});
socketClient.on("data", (chunk) => {
  console.log("bemfa data", chunk.toString("utf8"));
});
