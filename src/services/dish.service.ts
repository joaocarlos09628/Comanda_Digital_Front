import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { Dish } from '../interfaces/dish.interface'; 
import { MenuItem } from '../app/menu-gerente/overview/overview.component'; 

const API_URL = 'http://localhost:8080/dishes';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient) { }

  // Converte um objeto Dish (do back-end) para um MenuItem (para o front-end)
  private mapDishToMenuItem(dish: Dish): MenuItem {
    return {
      id: dish.id || 0,
      UrlImage: dish.UrlImage,
      nome: dish.name,
      // CONVERSÃO CRÍTICA: Number (price) para String (preco: "R$ X.XX")
      preco: `R$ ${dish.price.toFixed(2).replace('.', ',')}`, 
      categoria: dish.category,
      tag: dish.tag,
      descricao: dish.description,
    };
  }
  
  // [NOVO] Converte um objeto MenuItem (do front-end) para um Dish (para o back-end)
  private mapMenuItemToDish(menuItem: MenuItem): Dish {
    return {
        id: menuItem.id,
        UrlImage: menuItem.UrlImage,
        name: menuItem.nome,
        // CONVERSÃO CRÍTICA: String ("R$ 49,90") para Number (49.90)
        price: parseFloat(menuItem.preco.replace('R$', '').replace(',', '.').trim()), 
        category: menuItem.categoria,
        tag: menuItem.tag,
        description: menuItem.descricao,
    };
}


  // 1. READ: Buscar todos os pratos
  findAll(): Observable<MenuItem[]> { 
    return this.http.get<Dish[]>(API_URL)
      .pipe(
        map(dishes => dishes.map(this.mapDishToMenuItem)) 
      );
  }

  // [COMPLETO] 2. READ: Buscar um prato por ID
  findById(id: number): Observable<MenuItem> {
      return this.http.get<Dish>(`${API_URL}/${id}`).pipe(
        map(this.mapDishToMenuItem)
      );
  }

  // 4. CREATE: Criar um novo prato (POST)
  create(menuItem: MenuItem): Observable<MenuItem> {
    // Usa o novo mapeamento para enviar o Dish formatado
    const dishToSend: Dish = this.mapMenuItemToDish(menuItem); 

    return this.http.post<Dish>(API_URL, dishToSend)
      .pipe(
        map(this.mapDishToMenuItem)
      );
  }

  // [COMPLETO] 5. UPDATE: Atualizar um prato (PUT)
  // ESTE MÉTODO CORRIGE O ERRO "A propriedade 'update' não existe"
  update(id: number, menuItem: MenuItem): Observable<MenuItem> { 
    const dishToSend: Dish = this.mapMenuItemToDish(menuItem);
    // Note que você precisa do ID para a URL
    return this.http.put<Dish>(`${API_URL}/${id}`, dishToSend).pipe(
      map(this.mapDishToMenuItem)
    );
  }

  // [COMPLETO] 6. DELETE: Deletar um prato (DELETE)
  // ESTE MÉTODO CORRIGE O ERRO "A propriedade 'delete' não existe"
  delete(id: number): Observable<void> { 
    // O retorno é vazio, mas a chamada é necessária
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}