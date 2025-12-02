import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItemDTO {
  dishName: string;
  dishImage?: string;
  quantity: number;
  price: number;
  subTotal?: number;
  dishId?: number | string;
}

export interface OrderDTO {
  id: number | string;
  status: string;
  total: number;
  items: OrderItemDTO[];
  createdAt?: string | number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  // Buscar todos os pedidos
  findAll(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(this.baseUrl);
  }

  // Buscar um pedido por id
  findById(id: number | string): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(`${this.baseUrl}/${id}`);
  }

  // Buscar por um status (retorna array de pedidos que correspondem)
  findByStatus(status: string): Observable<OrderDTO[]> {
    if (!status) return this.findAll();
    const url = `${this.baseUrl}?status=${encodeURIComponent(status)}`;
    return this.http.get<OrderDTO[]>(url);
  }

  // Buscar por múltiplos status via query string: /orders?status=READY&status=ON_THE_WAY
  findByStatuses(statuses: string[]): Observable<OrderDTO[]> {
    if (!statuses || statuses.length === 0) return this.findAll();
    const params = statuses.map(s => `status=${encodeURIComponent(s)}`).join('&');
    const url = `${this.baseUrl}?${params}`;
    return this.http.get<OrderDTO[]>(url);
  }

  // Criar pedido (se necessário)
  create(payload: any): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  // Adiciona/atualiza um item no rascunho (carrinho)
  addItem(orderId: number | string, item: { quantity: number; price: number; dishId: number | string } ): Observable<any> {
    const body = {
      quantity: item.quantity,
      price: item.price,
      dishId: item.dishId
    };
    return this.http.post(`${this.baseUrl}/${orderId}/items`, body);
  }

  // Finaliza o pedido (POST /{orderId}/finalize)
  finalize(orderId: number | string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orderId}/finalize`, null);
  }

  // Atualizar status via PATCH /{id}/status?status=...
  updateStatus(id: number | string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status`, null, { params: { status } });
  }
}
