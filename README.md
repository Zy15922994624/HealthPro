# 个人健康管理系统（Personal Health System）

## 项目介绍
个人健康管理系统（PHS）是一个基于Spring Boot的健康数据管理平台，旨在帮助用户记录和管理个人健康数据。系统提供全面的健康数据追踪、分析和管理功能，帮助用户建立健康的生活方式。

## 需求分析

### 一、后台管理端（Spring Boot + JWT）
#### 1. 系统管理
- 管理员登录/登出
- 修改管理员密码

#### 2. 用户管理
- 用户信息查看
- 用户账号状态管理（启用/禁用）
- 用户数据统计

#### 3. 基础数据管理
- 运动类型管理
- 食物类型及营养成分管理
- 健康指标参考值管理

#### 4. 数据统计分析
- 用户活跃度分析
- 健康数据统计报表
- 系统使用情况统计

### 二、用户端（UniApp）
#### 1. 用户功能
- 用户注册/登录
- 个人信息管理
- 头像上传
- 密码修改

#### 2. 健康数据管理
##### 2.1 运动记录
- 运动类型选择
- 运动时长记录
- 运动强度记录
- 卡路里消耗查看
- 运动计划制定

##### 2.2 饮食记录
- 每日饮食记录
- 食物搜索添加
- 营养成分查看
- 卡路里摄入统计

##### 2.3 身体指标
- 体重记录
- BMI计算
- 体脂率记录
- 血压/心率记录

##### 2.4 睡眠记录
- 睡眠时间记录
- 睡眠质量评价
- 睡眠报告查看

#### 3. 数据展示
- 健康数据趋势图
- 目标完成进度
- 健康评分展示
- 个性化建议展示

#### 4. 其他功能
- 健康目标设定
- 提醒功能设置
- 数据导出

## 技术栈
### 后台管理端（Admin）
- **前端框架：** Vue 2.x + Element UI
- **后端框架：** Spring Boot 3.3.2
- **数据库：** MySQL 8.0
- **缓存：** Redis
- **ORM：** MyBatis-Plus 3.5.5
- **认证：** JWT
- **工具：** Lombok、Hutool
- **其他：** 参数校验、日志管理

### 用户端（App）
- **前端框架：** UniApp
- **UI框架：** uni-ui（官方UI库）
  - 跨端兼容性好
  - 组件丰富完整
  - 性能优化好
  - 支持主题定制
  - 适配多端样式

## 项目结构
```text
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── itzy/
│   │           ├── controller/    # 控制器层
│   │           │   ├── UserController.java
│   │           │   ├── SportController.java
│   │           │   ├── DietController.java
│   │           │   └── HealthController.java
│   │           ├── service/       # 服务层
│   │           │   ├── impl/
│   │           │   ├── UserService.java
│   │           │   ├── SportService.java
│   │           │   └── HealthService.java
│   │           ├── mapper/        # 数据访问层
│   │           ├── entity/        # 实体类
│   │           ├── dto/           # 数据传输对象
│   │           ├── vo/            # 视图对象
│   │           ├── config/        # 配置类
│   │           │   ├── RedisConfig.java
│   │           │   └── WebConfig.java
│   │           ├── utils/         # 工具类
│   │           └── common/        # 公共类
│   │               ├── response/
│   │               └── exception/
│   └── resources/
│       ├── application.yml        # 主配置文件
│       └── mapper/               # MyBatis映射文件
```

## 数据库设计
### 主要数据表
#### 1. user_info（用户信息表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 用户ID | PK |
| username | varchar(50) | 用户名 | UK |
| password | varchar(100) | 密码 | - |
| nickname | varchar(50) | 昵称 | - |
| avatar | varchar(255) | 头像URL | - |
| gender | tinyint | 性别 0-女 1-男 | - |
| age | int | 年龄 | - |
| height | decimal(5,2) | 身高(cm) | - |
| weight | decimal(5,2) | 体重(kg) | - |
| phone | varchar(20) | 手机号 | - |
| status | tinyint | 状态 0-禁用 1-正常 | - |
| create_time | datetime | 创建时间 | - |
| update_time | datetime | 更新时间 | - |

#### 2. sport_record（运动记录表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 记录ID | PK |
| user_id | bigint | 用户ID | IDX |
| sport_type | int | 运动类型 | - |
| start_time | datetime | 开始时间 | - |
| end_time | datetime | 结束时间 | - |
| duration | int | 运动时长(分钟) | - |
| intensity | tinyint | 运动强度 1-轻度 2-中度 3-重度 | - |
| calories | decimal(8,2) | 消耗卡路里 | - |
| heart_rate | int | 心率 | - |
| remark | varchar(255) | 备注 | - |
| create_time | datetime | 创建时间 | IDX |

#### 3. sport_type（运动类型表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | int | 类型ID | PK |
| name | varchar(50) | 运动名称 | - |
| mets | decimal(4,2) | METs值 | - |
| description | varchar(255) | 描述 | - |
| status | tinyint | 状态 0-禁用 1-正常 | - |

#### 4. diet_record（饮食记录表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 记录ID | PK |
| user_id | bigint | 用户ID | IDX |
| meal_time | datetime | 用餐时间 | IDX |
| meal_type | tinyint | 餐类型 1-早餐 2-午餐 3-晚餐 4-加餐 | - |
| food_name | varchar(100) | 食物名称 | - |
| food_weight | decimal(6,2) | 食物重量(g) | - |
| calories | decimal(8,2) | 卡路里 | - |
| protein | decimal(6,2) | 蛋白质(g) | - |
| fat | decimal(6,2) | 脂肪(g) | - |
| carbohydrate | decimal(6,2) | 碳水化合物(g) | - |
| create_time | datetime | 创建时间 | - |

#### 5. health_index（健康指标表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 记录ID | PK |
| user_id | bigint | 用户ID | IDX |
| record_time | datetime | 记录时间 | IDX |
| weight | decimal(5,2) | 体重(kg) | - |
| bmi | decimal(4,2) | BMI指数 | - |
| body_fat | decimal(4,2) | 体脂率(%) | - |
| blood_pressure_systolic | int | 收缩压 | - |
| blood_pressure_diastolic | int | 舒张压 | - |
| heart_rate | int | 心率 | - |
| create_time | datetime | 创建时间 | - |

#### 6. sleep_record（睡眠记录表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 记录ID | PK |
| user_id | bigint | 用户ID | IDX |
| sleep_time | datetime | 入睡时间 | IDX |
| wake_time | datetime | 醒来时间 | - |
| duration | int | 睡眠时长(分钟) | - |
| quality | tinyint | 睡眠质量 1-差 2-一般 3-良好 4-优秀 | - |
| remark | varchar(255) | 备注 | - |
| create_time | datetime | 创建时间 | - |

#### 7. admin_user（管理员表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 管理员ID | PK |
| username | varchar(50) | 用户名 | UK |
| password | varchar(100) | 密码 | - |
| nickname | varchar(50) | 昵称 | - |
| status | tinyint | 状态 0-禁用 1-正常 | - |
| create_time | datetime | 创建时间 | - |
| update_time | datetime | 更新时间 | - |

#### 8. food_base（食物基础数据表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 主键ID | PK |
| name | varchar(100) | 食物名称 | IDX |
| category | varchar(50) | 食物分类 | IDX |
| unit | varchar(20) | 单位 | - |
| calories | decimal(8,2) | 每100g热量(kcal) | - |
| protein | decimal(6,2) | 每100g蛋白质(g) | - |
| fat | decimal(6,2) | 每100g脂肪(g) | - |
| carbohydrate | decimal(6,2) | 每100g碳水化合物(g) | - |
| status | tinyint | 状态 0-禁用 1-正常 | - |
| create_time | datetime | 创建时间 | - |
| update_time | datetime | 更新时间 | - |

#### 9. health_reference（健康指标参考值表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 主键ID | PK |
| index_type | varchar(50) | 指标类型 | IDX |
| gender | tinyint | 性别 0-女 1-男 2-通用 | IDX |
| age_min | int | 年龄下限 | - |
| age_max | int | 年龄上限 | - |
| value_min | decimal(10,2) | 参考值下限 | - |
| value_max | decimal(10,2) | 参考值上限 | - |
| unit | varchar(20) | 单位 | - |
| status | tinyint | 状态 0-禁用 1-正常 | - |
| create_time | datetime | 创建时间 | - |
| update_time | datetime | 更新时间 | - |

#### 10. user_login_log（用户登录日志表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 日志ID | PK |
| user_id | bigint | 用户ID | IDX |
| login_time | datetime | 登录时间 | IDX |
| login_ip | varchar(50) | 登录IP | - |
| device_type | varchar(50) | 设备类型 | - |
| status | tinyint | 状态 0-失败 1-成功 | - |
| create_time | datetime | 创建时间 | - |

### 表关系说明
1. user_info（用户表）与其他表的关系：
   - user_info 1:N sport_record（一个用户可以有多条运动记录）
   - user_info 1:N diet_record（一个用户可以有多条饮食记录）
   - user_info 1:N health_index（一个用户可以有多条健康指标记录）
   - user_info 1:N sleep_record（一个用户可以有多条睡眠记录）

2. sport_type（运动类型表）与sport_record的关系：
   - sport_type 1:N sport_record（一个运动类型可以对应多条运动记录）

3. food_base表为独立的基础数据表，由管理员维护
4. health_reference表为独立的基础数据表，由管理员维护
5. user_login_log表与user_info表通过user_id关联

### 外键约束
1. sport_record表：
   - user_id -> user_info(id)
   - sport_type -> sport_type(id)

2. diet_record表：
   - user_id -> user_info(id)

3. health_index表：
   - user_id -> user_info(id)

4. sleep_record表：
   - user_id -> user_info(id)

5. user_login_log表：
   - user_id -> user_info(id)

### 级联规则
- 用户删除时，相关记录级联删除（ON DELETE CASCADE）
- 运动类型禁用时，不允许删除（需要在应用层控制）

### 索引说明
- PK：主键索引
- UK：唯一索引
- IDX：普通索引
- -：无索引

### 字段规范
1. 主键统一使用bigint，自增
2. 创建时间、更新时间统一使用datetime
3. 状态字段统一使用tinyint
4. 金额、重量等精确数值使用decimal

## 开发环境
- JDK 17
- Maven 3.x
- MySQL 8.0
- Redis 6.x
- IDEA 2023.x

## 开发规范
1. 代码规范
   - 遵循阿里巴巴Java开发手册
   - 使用统一的代码格式化模板
   - 必要的注释和文档

2. 接口规范
   - RESTful API设计规范
   - 统一的返回格式
   - 详细的接口文档

3. 安全规范
   - 密码加密存储
   - 敏感数据加密
   - 接口访问控制

## 项目计划
### 第一阶段：基础框架搭建（5天）
- [x] 项目初始化
- [ ] 基础框架搭建
- [ ] 数据库设计
- [ ] 通用功能实现

### 第二阶段：核心功能开发（15天）
- [ ] 用户模块开发
- [ ] 运动模块开发
- [ ] 饮食模块开发
- [ ] 健康指标模块开发

### 第三阶段：功能完善（10天）
- [ ] 数据分析功能
- [ ] 报表统计功能
- [ ] 系统优化
- [ ] 单元测试

## 部署说明
1. 环境准备
   - JDK 17安装配置
   - MySQL数据库安装
   - Redis服务安装

2. 项目部署
   - 数据库初始化
   - 配置文件修改
   - 项目打包部署

## 注意事项
1. 确保开发环境完整配置
2. 遵循代码规范和命名规范
3. 做好代码版本控制
4. 及时编写技术文档

## 系统架构
### 前后端分离
1. 后台管理端
   - 前端技术栈：Vue 2.x + Element UI
   - 后端技术栈：Spring Boot + JWT + MyBatis-Plus
   - 职责：系统管理、数据维护、统计分析
   - 特点：
     - Element UI组件库，提供统一的后台管理界面
     - Vue 2.x的响应式数据管理
     - 后台管理系统常用功能封装

2. 用户端
   - 技术栈：UniApp + uni-ui
   - 职责：用户健康数据管理、数据展示、个性化服务
   - 特点：
     - 一套代码，多端运行
     - 原生性能体验
     - 丰富的跨端组件

### 数据流转
```text
用户端(UniApp) <-> API接口 <-> 后台服务 <-> 数据库/缓存
```

## 核心功能实现说明
### 1. 运动管理核心算法
- 卡路里计算：weight * METs * duration
- 运动强度评估：基于心率和年龄的计算公式
- 运动计划完成度追踪

### 2. 数据安全
- JWT token认证
- 密码加密存储（MD5）
- 敏感数据脱敏

### 3. 性能优化
- Redis缓存策略
- MyBatis-Plus性能优化
- 大数据量处理方案

## 项目进度管理
### 每日任务
1. 代码开发
2. 单元测试
3. 文档更新
4. 代码审查

### 项目里程碑
1. 基础框架搭建（3天）
   - [x] 项目初始化
   - [ ] 基础配置完成
   - [ ] 数据库设计

2. 核心功能开发（12天）
   - [ ] 用户认证模块
   - [ ] 运动管理模块
   - [ ] 饮食管理模块

3. 系统优化（5天）
   - [ ] 性能优化
   - [ ] 安全加固
   - [ ] 文档完善

## 测试计划
1. 单元测试
2. 接口测试
3. 性能测试
4. 安全测试

## 维护计划
1. 日常维护
   - 系统监控
   - 数据备份
   - 日志分析

2. 版本更新
   - 功能迭代
   - Bug修复
   - 性能优化

## 常见问题
1. 运行环境配置
2. 开发环境搭建
3. 部署注意事项

## 联系方式
- 项目负责人：[姓名]
- 联系邮箱：[邮箱]
- 技术支持：[联系方式]

## 用户端功能实现说明

### 1. 运动管理模块
#### 1.1 卡路里计算
```java
calories = weight * METs * duration / 60.0
```
- weight: 用户体重(kg)
- METs: 运动强度代谢当量
- duration: 运动时长(分钟)

#### 1.2 运动强度判定
1. 基于心率的判定
```java
maxHeartRate = 220 - age;
percentage = heartRate / maxHeartRate;
if (percentage < 0.6) return LIGHT;      // 轻度运动
if (percentage < 0.7) return MODERATE;   // 中度运动
return VIGOROUS;                         // 重度运动
```

2. 基于运动类型的判定
```java
// 不同运动类型对应的METs值
WALKING = 3.0;          // 步行
JOGGING = 7.0;          // 慢跑
RUNNING = 12.0;         // 跑步
SWIMMING = 6.0;         // 游泳
CYCLING = 8.0;          // 骑行
```

#### 1.3 运动建议生成
- 基于用户BMI指数
- 考虑用户运动历史
- 结合用户健康目标
- 参考运动科学指南

### 2. 饮食管理模块
#### 2.1 营养计算
```java
// 每100g食物的营养换算
calories = food.caloriesPer100g * weight / 100;
protein = food.proteinPer100g * weight / 100;
fat = food.fatPer100g * weight / 100;
carbs = food.carbsPer100g * weight / 100;
```

#### 2.2 饮食分析
- 营养均衡评估
- 热量摄入分析
- 饮食习惯分析
- 营养素缺失提醒

### 3. 健康指标分析
#### 3.1 BMI计算
```java
bmi = weight / Math.pow(height/100, 2);

// BMI判定标准
if (bmi < 18.5) return "偏瘦";
if (bmi < 24.0) return "正常";
if (bmi < 28.0) return "偏胖";
return "肥胖";
```

#### 3.2 健康评分计算
```java
healthScore = 100;

// 体重评分 (30分)
weightScore = evaluateWeight(bmi);
// 运动评分 (30分)
sportScore = evaluateSport(sportFrequency, sportDuration);
// 睡眠评分 (20分)
sleepScore = evaluateSleep(sleepDuration, sleepQuality);
// 饮食评分 (20分)
dietScore = evaluateDiet(dietRecords);

healthScore = weightScore + sportScore + sleepScore + dietScore;
```

### 4. 目标管理模块
#### 4.1 目标类型
1. 减重目标
   - 每周减重0.5-1kg
   - 控制热量摄入
   - 增加有氧运动

2. 增重目标
   - 科学增重计划
   - 蛋白质摄入建议
   - 力量训练计划

3. 健康维护目标
   - 保持健康体重
   - 规律运动建议
   - 均衡饮食指导

#### 4.2 进度追踪
```java
// 目标完成度计算
progressPercentage = (currentValue - startValue) / (targetValue - startValue) * 100;

// 趋势预测
estimatedDaysToGoal = calculateDaysToGoal(progressRate, remainingProgress);
```

### 5. 数据可视化
#### 5.1 图表类型
1. 体重变化趋势图
2. 运动量统计图
3. 睡眠质量分析图
4. 营养摄入比例图

#### 5.2 健康报告
- 周期：每周/每月/每季度
- 内容：
  - 健康指标变化
  - 目标完成情况
  - 生活习惯分析
  - 个性化建议

### 6. 实现要点
1. **数据准确性**
   - 数据验证和清洗
   - 异常值处理
   - 计算精度控制

2. **性能优化**
   - Redis缓存
   - 分页查询
   - 延迟加载

3. **用户体验**
   - 数据录入便捷
   - 展示直观清晰
   - 操作响应及时

4. **安全性**
   - 数据加密存储
   - 访问权限控制
   - 敏感信息保护

### 7. 健康目标提醒功能
#### 7.1 功能说明
- 设置健康目标（体重、BMI、运动）
- 自定义提醒时间
- 每日定时提醒
- 提醒开关控制
- 提醒内容个性化

#### 7.2 业务需求
1. 目标设置
   - 目标体重范围：20-200kg
   - 目标BMI范围：16-35
   - 每日步数：1000-50000步
   - 运动时长：10-300分钟

2. 提醒设置
   - 自定义提醒时间（24小时制）
   - 提醒开关控制
   - 每日仅提醒一次
   - 提醒后自动设置次日提醒

3. 提醒内容
   - 目标体重和BMI
   - 每日步数目标
   - 运动时长目标
   - 温馨提示语

#### 7.3 数据库设计
##### user_settings（用户设置表）
| 字段名 | 类型 | 说明 | 索引 |
|-------|------|------|------|
| id | bigint | 设置ID | PK |
| user_id | bigint | 用户ID | IDX |
| target_weight | decimal(5,2) | 目标体重(kg) | - |
| target_bmi | decimal(4,2) | 目标BMI | - |
| target_steps | int | 目标步数 | - |
| target_duration | int | 目标运动时长(分钟) | - |
| enable_reminder | tinyint | 是否开启提醒 0-关闭 1-开启 | - |
| reminder_time | varchar(5) | 提醒时间(HH:mm) | - |
| enable_notification | tinyint | 是否开启通知 0-关闭 1-开启 | - |
| enable_sync | tinyint | 是否开启同步 0-关闭 1-开启 | - |
| show_bmi | tinyint | 是否显示BMI 0-隐藏 1-显示 | - |
| show_blood_pressure | tinyint | 是否显示血压 0-隐藏 1-显示 | - |
| create_time | datetime | 创建时间 | - |
| update_time | datetime | 更新时间 | - |

#### 7.4 实现要点
1. 提醒机制
```java
// 检查是否需要提醒
if (now >= nextReminderTime) {
    // 发送提醒
    sendReminder();
    // 设置下一次提醒时间
    setNextReminderTime(reminderTime);
}
```

2. 提醒内容格式
```java
// 提醒内容模板
content = `目标:${targetWeight}kg/${targetBMI}BMI`;
sportName = `${targetSteps}步/天`;
tips = `运动${targetDuration}分钟/天`;
```

3. 数据验证
```java
// 目标数值验证
if (targetWeight < 20 || targetWeight > 200) return false;
if (targetBMI < 16 || targetBMI > 35) return false;
if (targetSteps < 1000 || targetSteps > 50000) return false;
if (targetDuration < 10 || targetDuration > 300) return false;
```

#### 7.5 注意事项
1. 提醒时间精确到分钟
2. 避免重复提醒
3. 确保数据类型转换正确
4. 处理时区差异
5. 保护用户隐私数据

### 健康指标参考值说明
1. BMI指数
   - 通用标准：18.50-23.90 kg/m²

2. 体脂率
   - 男性：
     * 18-39岁：10.00-20.00%
     * 40-59岁：11.00-22.00%
     * 60岁以上：13.00-25.00%
   - 女性：
     * 18-39岁：18.00-28.00%
     * 40-59岁：19.00-29.00%
     * 60岁以上：21.00-31.00%

3. 血压
   - 收缩压：90.00-140.00 mmHg (通用标准)
   - 舒张压：60.00-90.00 mmHg (通用标准)

4. 心率
   - 静息心率：60.00-100.00 次/分 (通用标准)

注意事项
1. gender字段使用2表示通用标准，可适用于所有性别
2. 部分指标（如体脂率）需要按性别和年龄段区分标准
3. 其他指标（如BMI、血压、心率）使用通用标准即可 