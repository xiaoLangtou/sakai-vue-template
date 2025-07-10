/**
 * 库存状态枚举
 */
export enum InventoryStatus {
  INSTOCK = 'INSTOCK',
  LOWSTOCK = 'LOWSTOCK',
  OUTOFSTOCK = 'OUTOFSTOCK'
}

/**
 * 库存状态类型（用于兼容字符串值）
 */
export type InventoryStatusValue = InventoryStatus | 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

/**
 * 产品接口
 */
export interface Product {
  /** 产品ID */
  id: string;
  /** 产品代码 */
  code: string;
  /** 产品名称 */
  name: string;
  /** 产品描述 */
  description: string;
  /** 产品图片 */
  image: string;
  /** 产品价格 */
  price: number;
  /** 产品分类 */
  category: string;
  /** 库存数量 */
  quantity: number;
  /** 库存状态 */
  inventoryStatus: InventoryStatusValue;
  /** 产品评分 */
  rating: number;
  /** 订单列表（可选） */
  orders?: any[];
}

/**
 * 产品服务接口
 */
export interface IProductService {
  /** 获取产品数据 */
  getProductsData(): Product[];
  /** 获取带订单的产品数据 */
  getProductsWithOrdersData(): Product[];
  /** 获取迷你产品列表 */
  getProductsMini(): Promise<Product[]>;
  /** 获取小型产品数据 */
  getProductsSmall(): Promise<Product[]>;
  /** 获取产品（异步） */
  getProducts(): Promise<Product[]>;
  /** 获取产品及订单数据 */
  getProductsWithOrdersSmall(): Promise<Product[]>;
  /** 获取带订单的产品列表 */
  getProductsWithOrders(): Promise<Product[]>;
}