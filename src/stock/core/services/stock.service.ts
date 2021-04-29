import { HttpException, HttpStatus, Injectable, NotImplementedException } from '@nestjs/common';
import { IStockService } from '../primary-ports/stock.service.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from '../models/stock.model';
import StockDb from '../../infrastructure/data-source/entities/stock.entity';
import { CreateStockDto } from '../../api/dto/CreateStockDto';

@Injectable()
export class StockService implements IStockService {
  constructor(
    @InjectRepository(StockDb) private stockRepository: Repository<StockDb>,
  ) {}

  async createStock(stock: CreateStockDto) {
    const newStock = await this.stockRepository.create(stock);
    await this.stockRepository.save(newStock);
    return newStock;
  }

  async deleteStock(id: number): Promise<void> {
    const deleteStock = await this.stockRepository.delete(id);
    if (!deleteStock.affected) {
      throw new HttpException('Stock not found', HttpStatus.NOT_FOUND);
    }
  }

  async getStockById(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne(id);
    if (stock) {
      return stock;
    }
    throw new HttpException('Stock not found', HttpStatus.NOT_FOUND);
  }

  async getStocks(): Promise<Stock[]> {
    const stocks = await this.stockRepository.find();
    const stocksDb: Stock[] = JSON.parse(JSON.stringify(stocks));
    return stocksDb;
  }

  async updateStock(stock: Stock): Promise<Stock> {
    await this.stockRepository.update(stock.id, stock);
    const updatedStock = await this.stockRepository.findOne(stock.id);
    if (updatedStock) {
      await this.stockRepository.save(updatedStock);
      console.log('stock updated!', updatedStock.name);
      return updatedStock;
    }
    throw new HttpException('Stock not found', HttpStatus.NOT_FOUND);
  }
}
