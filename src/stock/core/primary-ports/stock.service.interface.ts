import { Stock } from '../models/stock.model';

export const IStockServiceProvider = 'IChatServiceProvider';

export interface IStockService {
  getStocks(): Promise<Stock[]>;

  getStockById(id: number): Promise<Stock>

  createStock(stock: Stock): Promise<Stock>;

  deleteStock(id: number): Promise<void>;

  updateStock(stock: Stock);
}
