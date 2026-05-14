# 看见音乐项目工作规则

本目录是“看见音乐”的独立项目根目录。

## 项目边界

- 只维护音乐/声音可视化产品相关内容。
- 默认本地服务端口：`4177`。
- 本地服务入口：`npm run start`。
- 本地访问地址：`http://localhost:4177`。

## 不属于本项目

- 富途牛牛相关脚本、OpenD 配置、行情接口、交易接口。
- Stockwave / 股票研究看板 / 美股七姐妹看板。
- 模拟盘、估值、资讯、资金流、期权、技术面分析等股票功能。

## 修改规则

- 修改看见音乐时，优先确认工作目录是 `/Users/shenjiwei/看见音乐`。
- 不引用 `/Users/shenjiwei/mag7-dashboard`、`/Users/shenjiwei/.agents/skills/futu*` 或其他富途相关目录的代码。
- 需要记录产品变更时，只更新本项目内的 `PRODUCT.md` 和 `USER_UPDATES.md`。
- 旧目录 `/Users/shenjiwei/music-visualizer-prototype` 仅视为迁移前备份，不作为后续维护入口。
