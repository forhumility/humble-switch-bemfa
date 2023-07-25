import { IStatusObserver } from "./../lib/bemfa";
/**
 * @Author       : Humility
 * @Date         : 2023-07-13 11:11:43
 * @LastEditTime : 2023-07-25 09:57:25
 * @LastEditors  : LST-Public
 * @FilePath     : \miot-pc-switch-bemfa\src\utils\bemfa-mqtt.ts
 * @Description  :
 */
import events from "events";
import { connect, MqttClient, IClientOptions } from "mqtt";

import { BemfaInfo, DeviceStatus } from "../lib/bemfa";
import { Computer } from "../lib/computer";
import { ComputerInfo } from "src/config/conf.computer";

export class BemfaMqtt extends events.EventEmitter implements IStatusObserver {
  mqttClient: MqttClient;
  url: string;
  options: IClientOptions;
  computerInfos: Array<ComputerInfo> = new Array<ComputerInfo>();
  computerList: Array<Computer> = new Array<Computer>();

  constructor(bemfaConf: BemfaInfo, devInfos: Array<ComputerInfo>) {
    super();

    const { host, mqttPort, secretKey } = bemfaConf;
    this.url = `mqtt://${host}:${mqttPort}`;
    this.options = {
      clientId: secretKey,
      keepalive: 40, // 默认60秒，设置0为禁用
      clean: true, // 设置为false以在脱机时接收QoS 1和2消息
      protocolId: "MQIsdp", // 只支持MQTT 3.1(不符合3.1.1)的代理
      protocolVersion: 3, // 版本
      reconnectPeriod: 1000, //设置多长时间进行重新连接 单位毫秒 两次重新连接之间的时间间隔。通过将设置为，禁用自动重新连接0
      connectTimeout: 10 * 1000, // 收到CONNACK之前等待的时间
    };
    this.computerInfos = devInfos;
  }
  init() {
    // 连接mqtt服务
    this.mqttClient = connect(this.url, this.options);
    this.mqttClient.on("connect", () => {
      this.emit("connect");
      this.computerInfos.forEach((info) => {
        const { theme } = info;
        // 订阅云端消息
        this.mqttClient.subscribe(theme, (err, topic) => {
          if (err) {
            this.emit("subscribeError", err);
          } else {
            this.emit("subscribed", topic);
          }
        });
        const computer = new Computer(theme);
        // 订阅电脑状态
        computer.statusObs.push(this);
        computer.init(info);
        // 添加到电脑列表
        this.computerList.push(computer);
      });
    });
    this.mqttClient.on("message", (topic, msg) => {
      const message = msg.toString("utf-8");
      this.emit("message", topic, message);
      const tagComputer = this.computerList.find((c) => c.theme == topic);
      if (!tagComputer) return;
      if (DeviceStatus[message] == DeviceStatus.on) {
        tagComputer.turnOn();
      }
      if (DeviceStatus[message] == DeviceStatus.off) {
        tagComputer.turnOff();
      }
    });
    this.mqttClient.on("packetsend", () => this.emit("packetsend"));
    this.mqttClient.on("disconnect", () => this.emit("disconnect"));
    this.mqttClient.on("error", (err) => this.emit("error", err));
    this.mqttClient.on("close", () => this.emit("close"));
    this.mqttClient.on("end", () => this.emit("end"));
  }
  /**
   * @param {DeviceStatus} status 设备状态
   * @param {Computer} dev 设备实例
   * @return {*}
   * @description: 监听设备状态改变 更新云端状态
   */
  statusChanged(status: DeviceStatus, dev: Computer) {
    const { theme, name } = dev;
    // 更新云端设备当前状态
    const currStatus = DeviceStatus[status];
    const upTopic = `${theme}/set`;
    console.log(name, currStatus);
    this.mqttClient.publish(upTopic, currStatus);
  }
  /**
   * @param {*} minute 轮询时间
   * @return {*}
   * @description: 电脑状态轮询(默认10分钟更新一次设备状态)
   */
  computerStatusPolling(minute = 10) {
    setInterval(() => {
      this.computerList.forEach((cmp) => {
        cmp.updateStatus();
      });
    }, minute * 60 * 1000);
  }
}
