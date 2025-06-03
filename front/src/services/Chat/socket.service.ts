// src/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

const SOCKET_URL = 'http://localhost:3000'; // Replace with your actual backend URL

export class SocketService {
  private socket: Socket;

  constructor() {
    console.log('SocketService: Connecting to', SOCKET_URL);
    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('SocketService: Successfully connected. Socket ID:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('SocketService: Connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('SocketService: Disconnected. Reason:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('SocketService: Socket error:', error);
    });
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  listen<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.socket.on(event, (data: T) => subscriber.next(data));
    });
  }

  off(event: string): void {
    this.socket.off(event);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketService = new SocketService();
export default socketService;
