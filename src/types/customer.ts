/**
 * 客户状态枚举
 */
export enum CustomerStatus {
  QUALIFIED = 'qualified',
  UNQUALIFIED = 'unqualified',
  PROPOSAL = 'proposal',
  RENEWAL = 'renewal',
  NEGOTIATION = 'negotiation',
  NEW = 'new'
}

/**
 * 客户状态类型（用于兼容字符串值）
 */
export type CustomerStatusValue = CustomerStatus | 'qualified' | 'unqualified' | 'proposal' | 'renewal' | 'negotiation' | 'new';

/**
 * 国家接口
 */
export interface Country {
  /** 国家名称 */
  name: string;
  /** 国家代码 */
  code: string;
}

/**
 * 代表接口
 */
export interface Representative {
  /** 代表姓名 */
  name: string;
  /** 代表头像 */
  image: string;
}

/**
 * 客户接口
 */
export interface Customer {
  /** 客户ID */
  id: number;
  /** 客户姓名 */
  name: string;
  /** 国家信息 */
  country: Country;
  /** 公司名称 */
  company: string;
  /** 日期 */
  date: string;
  /** 客户状态 */
  status: CustomerStatusValue;
  /** 是否已验证 */
  verified: boolean;
  /** 活跃度 */
  activity: number;
  /** 代表信息 */
  representative: Representative;
  /** 余额 */
  balance: number;
}

/**
 * 客户服务接口
 */
export interface ICustomerService {
  /** 获取客户数据 */
  getData(): Customer[];
  /** 获取客户（异步） */
  getCustomers(): Promise<Customer[]>;
  /** 获取小型客户数据 */
  getCustomersSmall(): Promise<Customer[]>;
  /** 获取中型客户数据 */
  getCustomersMedium(): Promise<Customer[]>;
  /** 获取大型客户数据 */
  getCustomersLarge(): Promise<Customer[]>;
  /** 获取超大型客户数据 */
  getCustomersXLarge(): Promise<Customer[]>;
}