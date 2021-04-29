import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import {
  IStockService,
  IStockServiceProvider,
} from '../../core/primary-ports/stock.service.interface';
import { Stock } from '../../core/models/stock.model';
import { CreateStockDto } from '../dto/CreateStockDto';

@WebSocketGateway()
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(IStockServiceProvider) private stockService: IStockService,
  ) {}

  @WebSocketServer() server;

  @SubscribeMessage('updateStock')
  async handleUpdateStockEvent(
    @MessageBody() stock: Stock,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const updateStock = await this.stockService.updateStock(stock);
    console.log('Updated stock:', updateStock.value);
    this.server.emit('stock-update', updateStock);
  }

  @SubscribeMessage('createStock')
  async handleCreateStock(
    @MessageBody() stock: CreateStockDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const newStock = await this.stockService.createStock(stock);
      this.server.emit('stock-created', newStock);
      //client.emit('stock-created', newStock);
    } catch (e) {
      client.emit('stock-created-error', e.message);
    }
  }

  @SubscribeMessage('deleteStock')
  async handleDeleteStock(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.stockService.deleteStock(id);
      this.server.emit('stock-deleted', id);
    } catch (e) {
      client.emit('stock-deleted-error', e.message);
    }
  }

  @SubscribeMessage('getAllStocks')
  async handleGetStocks(@ConnectedSocket() client: Socket): Promise<void> {
    const allStocks = await this.stockService.getStocks();
    this.server.emit('stock-getAll', allStocks);
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    console.log('Client connected: ' + client.id);
    this.server.emit('stocks', await this.stockService.getStocks());
  }

  async handleDisconnect(client: Socket): Promise<any> {
    console.log('Client disconnected: ' + client.id);
    this.server.emit('stocks', await this.stockService.getStocks());
  }
}
