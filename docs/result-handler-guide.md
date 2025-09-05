# TypeScript 错误处理工具：优雅的 Result 模式实现

## 前言

在现代 JavaScript/TypeScript 开发中，错误处理一直是一个令人头疼的问题。传统的 `try-catch` 语句虽然功能强大，但往往会导致代码嵌套过深、可读性差，特别是在处理多层异步调用时。本文将介绍一个基于 Result 模式的错误处理工具，它借鉴了 Rust 语言的设计理念，为 TypeScript 项目提供了一种更加优雅和类型安全的错误处理方案。

## 什么是 Result 模式？

Result 模式是一种函数式编程中的错误处理模式，它将操作的结果封装在一个联合类型中：
- 成功时包含结果值
- 失败时包含错误信息

这种模式的核心优势在于：
1. **显式错误处理**：强制开发者处理可能的错误情况
2. **类型安全**：编译时就能发现潜在的错误处理问题
3. **函数式风格**：支持链式调用和值转换
4. **避免异常抛出**：减少运行时异常的风险

## 核心设计

### Result 类型定义

```typescript
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
```

这个联合类型是整个工具的核心，它明确区分了成功和失败两种状态：
- `T`：成功时的值类型
- `E`：错误类型，默认为 `Error`
- `ok` 字段：用于类型守卫，区分成功和失败状态

### 安全执行函数

#### 同步代码执行：safeRun

```typescript
export function safeRun<T, E = Error>(fn: () => T): Result<T, E> {
    try {
        return { ok: true, value: fn() };
    } catch (error) {
        return { ok: false, error: error as E };
    }
}
```

`safeRun` 函数将任何可能抛出异常的同步函数包装成返回 Result 类型的安全函数。

**使用示例：**
```typescript
// 解析 JSON 字符串
const parseResult = safeRun(() => JSON.parse(jsonString));
if (parseResult.ok) {
    console.log('解析成功:', parseResult.value);
} else {
    console.error('解析失败:', parseResult.error);
}

// 数组访问
const getItemResult = safeRun(() => array[index]);
if (getItemResult.ok) {
    // 安全使用 getItemResult.value
}
```

#### 异步代码执行：to

```typescript
export async function to<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
        return { ok: true, value: await promise };
    } catch (error) {
        return { ok: false, error: error as E };
    }
}
```

`to` 函数专门用于处理 Promise，将可能 reject 的 Promise 转换为返回 Result 的 Promise。

**使用示例：**
```typescript
// API 调用
const apiResult = await to(fetch('/api/users'));
if (apiResult.ok) {
    const response = apiResult.value;
    // 处理响应
} else {
    console.error('API 调用失败:', apiResult.error);
}

// 文件操作
const fileResult = await to(fs.readFile('config.json', 'utf8'));
if (fileResult.ok) {
    const content = fileResult.value;
    // 处理文件内容
}
```

### ResultHandler 处理类

`ResultHandler` 类提供了强大的链式操作能力，让错误处理变得更加灵活和优雅。

#### map 方法：转换成功值

```typescript
map<U>(fn: (value: T) => U): ResultHandler<U, E>
```

`map` 方法只在结果成功时执行转换函数，失败时直接传递错误。

**使用示例：**
```typescript
const result = new ResultHandler(parseResult)
    .map(data => data.users)           // 提取用户数组
    .map(users => users.length)        // 获取用户数量
    .map(count => `共有 ${count} 个用户`); // 格式化消息

if (result.get().ok) {
    console.log(result.get().value); // "共有 10 个用户"
}
```

#### mapErr 方法：转换错误值

```typescript
mapErr<F>(fn: (error: E) => F): ResultHandler<T, F>
```

`mapErr` 方法只在结果失败时执行转换函数，成功时直接传递值。

**使用示例：**
```typescript
const result = new ResultHandler(apiResult)
    .mapErr(error => ({
        code: 'API_ERROR',
        message: `API 调用失败: ${error.message}`,
        timestamp: new Date().toISOString()
    }));
```

#### unwrap 方法：获取值或抛出异常

```typescript
unwrap(): T
```

`unwrap` 方法用于获取成功的值，如果结果是失败状态，则抛出异常。

**注意：** 只有在确定结果一定成功时才使用此方法。

#### get 方法：获取原始 Result

```typescript
get(): Result<T, E>
```

`get` 方法返回原始的 Result 结构，用于最终的错误检查。

## 实际应用场景

### 1. API 调用链

```typescript
async function getUserProfile(userId: string) {
    const userResult = await to(fetchUser(userId));
    const profileResult = await to(fetchUserProfile(userId));
    
    return new ResultHandler(userResult)
        .map(user => ({ user }))
        .map(async data => {
            if (profileResult.ok) {
                return { ...data, profile: profileResult.value };
            }
            return data;
        })
        .mapErr(error => ({
            type: 'USER_FETCH_ERROR',
            message: `获取用户信息失败: ${error.message}`,
            userId
        }));
}
```

### 2. 数据验证和转换

```typescript
function processUserInput(input: string) {
    return new ResultHandler(safeRun(() => JSON.parse(input)))
        .map(data => validateUserData(data))
        .map(userData => transformUserData(userData))
        .mapErr(error => ({
            field: 'user_input',
            message: '用户输入格式错误',
            originalError: error
        }));
}
```

### 3. 配置文件加载

```typescript
async function loadConfig(configPath: string) {
    const fileResult = await to(fs.readFile(configPath, 'utf8'));
    
    return new ResultHandler(fileResult)
        .map(content => safeRun(() => JSON.parse(content)))
        .map(parseResult => {
            if (parseResult.ok) {
                return parseResult.value;
            }
            throw new Error('配置文件格式错误');
        })
        .map(config => validateConfig(config))
        .mapErr(error => ({
            configPath,
            error: error.message,
            suggestion: '请检查配置文件格式是否正确'
        }));
}
```

## 与传统错误处理的对比

### 传统 try-catch 方式

```typescript
async function traditionalApproach(userId: string) {
    try {
        const user = await fetchUser(userId);
        try {
            const profile = await fetchUserProfile(userId);
            try {
                const settings = await fetchUserSettings(userId);
                return {
                    user,
                    profile,
                    settings
                };
            } catch (settingsError) {
                console.error('获取用户设置失败:', settingsError);
                return { user, profile };
            }
        } catch (profileError) {
            console.error('获取用户资料失败:', profileError);
            return { user };
        }
    } catch (userError) {
        console.error('获取用户失败:', userError);
        throw new Error('无法获取用户信息');
    }
}
```

### Result 模式方式

```typescript
async function resultApproach(userId: string) {
    const userResult = await to(fetchUser(userId));
    const profileResult = await to(fetchUserProfile(userId));
    const settingsResult = await to(fetchUserSettings(userId));
    
    return new ResultHandler(userResult)
        .map(user => ({ user }))
        .map(data => profileResult.ok ? { ...data, profile: profileResult.value } : data)
        .map(data => settingsResult.ok ? { ...data, settings: settingsResult.value } : data)
        .mapErr(error => ({
            type: 'USER_DATA_ERROR',
            message: '获取用户数据失败',
            details: error
        }));
}
```

## 最佳实践

### 1. 错误类型定义

为不同的错误场景定义具体的错误类型：

```typescript
interface ApiError {
    code: string;
    message: string;
    statusCode?: number;
}

interface ValidationError {
    field: string;
    message: string;
    value: any;
}

// 使用具体的错误类型
const apiResult: Result<User, ApiError> = await to(fetchUser(id));
```

### 2. 错误处理策略

```typescript
function handleResult<T>(result: Result<T, any>) {
    if (result.ok) {
        return result.value;
    }
    
    // 根据错误类型采取不同的处理策略
    if (result.error.code === 'NETWORK_ERROR') {
        // 网络错误，可以重试
        return retryOperation();
    } else if (result.error.code === 'VALIDATION_ERROR') {
        // 验证错误，提示用户
        showValidationError(result.error);
    } else {
        // 其他错误，记录日志
        logger.error('Unexpected error:', result.error);
    }
}
```

### 3. 组合多个操作

```typescript
async function complexOperation(data: InputData) {
    const step1 = await to(validateInput(data));
    if (!step1.ok) return step1;
    
    const step2 = await to(processData(step1.value));
    if (!step2.ok) return step2;
    
    const step3 = await to(saveResult(step2.value));
    return step3;
}
```

## 性能考虑

Result 模式的性能开销主要来自：
1. 对象创建：每次操作都会创建新的 Result 对象
2. 类型检查：运行时需要检查 `ok` 字段

但这些开销通常是可以接受的，特别是考虑到它带来的类型安全和代码可维护性提升。

## 总结

这个 TypeScript 错误处理工具通过引入 Result 模式，为项目提供了一种更加优雅、类型安全的错误处理方案。它的主要优势包括：

1. **类型安全**：编译时就能发现错误处理问题
2. **可读性强**：避免了深层嵌套的 try-catch 结构
3. **函数式风格**：支持链式调用和值转换
4. **显式错误处理**：强制开发者考虑错误情况
5. **统一接口**：所有操作都返回统一的 Result 类型

虽然这种模式需要一定的学习成本，但一旦掌握，它将大大提升代码的健壮性和可维护性。特别是在复杂的业务逻辑和异步操作处理中，Result 模式的优势会更加明显。

建议在新项目中逐步采用这种错误处理模式，特别是在关键的业务逻辑和 API 调用中。随着团队对这种模式的熟悉，可以进一步扩展和完善这个工具，比如添加更多的组合子函数、支持并行操作等。
