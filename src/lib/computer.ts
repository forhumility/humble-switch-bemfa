/**
 * @Author       : Humility
 * @Date         : 2023-07-13 10:28:04
 * @LastEditTime : 2023-07-14 15:15:51
 * @LastEditors  : Humility
 * @FilePath     : \miot-pc-switch-bemfa\src\lib\computer.ts
 * @Description  :
 */
// 子进程
const { execSync } = require("child_process");
// ssh客户端
const { Client } = require("ssh2");
// 网络唤醒
const { wake } = require("wake_on_lan");

import { ComputerInfo } from "src/config/conf.computer";
import { DeviceStatus, BemfaDevice } from "./bemfa";

export class Computer extends BemfaDevice {
  ip: string;
  mac: string;
  user: string;
  password: string;
  timeout?: 30;
  countdown?: 20;
  private step: 500;
  constructor(cxt) {
    super(cxt);
  }
  /**
   * 初始化电脑
   * @param info 电脑信息
   */
  init(info: ComputerInfo) {
    const { name, ip, mac, user, password } = info;
    this.name = name || "设备";
    this.ip = ip;
    this.mac = mac;
    this.user = user;
    this.password = password;
    this.status = this.getStatus();
  }
  async turnOn() {
    if (this.status == DeviceStatus.on) {
      console.log(`【${this.name}】已经开啦。`);
      this.status = 1;
    } else {
      wake(this.ip, (err) => {
        let msg = err ? "turn-on error" : "turn-on success";
        console.log(msg);
      });
    }
  }
  async turnOff() {
    if (this.status == DeviceStatus.on) {
      const turnOffCMD = `shutdown -s -f -c 将在${this.countdown}秒内关闭这个电脑 -t ${this.countdown}`;
      const sshClient = new Client();
      sshClient
        .on("ready", () => {
          sshClient.exec(turnOffCMD, (err, stream) => {
            if (err) {
              console.warn("exec error", err);
              return sshClient.end();
            }
            stream
              .on("close", (code) => {
                console.log("stream close", code);
                sshClient.end();
              })
              .on("data", (data) => {
                console.log("stream data", data.toString("utf-8"));
              });
          });
        })
        .on("error", (err) => {
          console.warn("err", err);
        })
        .connect({
          host: this.ip,
          port: "22",
          username: this.user,
          password: this.password,
        });
      let timer = 0;
      while (this.getStatus() && timer < this.timeout) {
        await this.sleep(this.step);
        timer += this.step;
      }
      if (timer >= this.timeout) {
        this.status = 1;
      } else {
        this.status = 0;
      }
    } else {
      console.log(`【${this.name}】已经关啦。`);
      this.status = 0;
    }
  }
  getStatus(): DeviceStatus {
    const pingCMD = `ping -n 1 -w 1 ${this.ip}`;
    try {
      execSync(pingCMD);
      return 1;
    } catch (error) {
      return 0;
    }
  }
  private sleep(mills: number) {
    return new Promise((resolve) => setTimeout(resolve, mills));
  }
}
