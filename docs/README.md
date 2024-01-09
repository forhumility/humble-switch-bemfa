# humble-switch-bemfa

> 小爱同学(miot)通过巴法云(bemfa)控制电脑开关机。

## 整体思路

1. 将电脑模拟成物联网设备（开关）
2. 通过提供物联网设备接入平台接入米家（bemfa、blinker等）
3. 设备状态：通过ping命令判断是否开/关机。
4. 设备开机：通过局域网唤醒（wol）
5. 设备关机：通过OpenSSH登录到设备并发送关机命令。

## 准备工作

- [bemfa](https://cloud.bemfa.com/tcp/devicemqtt.html)上添加设备

- 米家APP->我的->添加其他平台->巴法

- 电脑开启 WOL(wake on lan)

  - 开机时连按 ESC/F2/F8/F12 进入 bios，找到电源管理（Power Managment），开启（Enabled）WOL / Wake PCI Card / Boot on LAN / PME Event WakeUp / Wake Up On PCI PME / ...
  - win+x 进入设备管理器找到网络适配器>网卡（Realtek PCle ...）>右键属性>高级>魔术封包唤醒，电源管理>允许此设备唤醒计算机。
  - 详情见[官方文档](https://learn.microsoft.com/zh-cn/mem/configmgr/core/clients/deploy/configure-wake-on-lan)

- 电脑安装 OpenSSH
  - win+s>搜索“管理可选功能”>添加功能>搜索“openssh”>安装 OpenSSH 客户端、OpenSSH 服务端。
  - 管理员身份运行 powershell > Start-Service sshd > Set-Service -Name sshd -StartupType 'Automatic'
  - 详情见[官方文档](https://learn.microsoft.com/zh-cn/windows-server/administration/openssh/openssh_install_firstuse)

- 准备一台接上局域网的小主机（用于部署本项目）

## 项目运行

### 克隆项目

```bash
git clone git@github.com:forhumility/humble-switch-bemfa.git
```

### 安装环境

```bash
npm run pre
```

### 配置

> 在[巴法云](https://cloud.bemfa.com/)创建 mqtt 主题

修改 src\config 文件夹下 conf.bemfa.ts 和 conf.computer.ts 两个配置文件

### 运行项目

```bash
npm run serve
```

## 项目部署

### 打包

```bash
npm run build
```

### 部署

使用 PM2 部署项目，参考[官方文档](https://pm2.fenxianglu.cn/docs/start)。将本项目部署到能访问局域网的主机上。

```bash
pm2 start index.js --name humble-switch
```

## 使用说明

项目运行/项目部署完成后唤醒小爱同学发送关闭/开启命令即可。
