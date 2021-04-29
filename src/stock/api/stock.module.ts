import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from '../core/services/stock.service';
import { StockGateway } from './gateways/stock.gateway';
import { IStockServiceProvider } from '../core/primary-ports/stock.service.interface';
import StockDb from '../infrastructure/data-source/entities/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockDb])],
  controllers: [],
  providers: [
    StockGateway,
    { provide: IStockServiceProvider, useClass: StockService },
  ],
})
export class StockModule {}
