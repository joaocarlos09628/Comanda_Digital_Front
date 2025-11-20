// Componente de modal para adicionar um item ao cardápio.
// Comentários escritos no mesmo tom que você pediu: explicando o que cada bloco faz, sem alterar a lógica.
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { trigger, transition, style, animate } from '@angular/animations';
import { MenuItem } from '../overview/overview.component'; // Importa a interface do item do cardápio

@Component({
  selector: 'app-add-item-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css']
  ,
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(20px)', opacity: 0 }),
        animate('220ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ transform: 'translateX(20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class AddItemModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() itemAdded = new EventEmitter<MenuItem>();

  
  // Modelo de formulário (usando FormsModule simples para agilidade)
  newItem: Partial<MenuItem> = {
    nome: '',
    preco: '',
    categoria: 'Pizza',
    descricao: '',
    foto: ''
 
 
  };
  // --------------------------------------------------
  // Método: onFileSelected
  // - Quando o usuário escolhe um arquivo, aqui eu pego o primeiro arquivo
  // - Atualizo o campo `newItem.foto` com um texto simples (aqui o código original usava apenas o nome do arquivo)
  // - Não faço upload real, apenas guardo a referência/nome para exibição
  // --------------------------------------------------
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Atualiza o campo de texto (URL da imagem) com o nome do arquivo.
      this.newItem.foto = 'Arquivo: ' + file.name;
      
      console.log('Arquivo selecionado:', file.name);
    }

  }

  // Fecha o modal sem enviar nada (emit para o componente pai)
  onCancel(): void {
    this.close.emit();
  }

  // Envia o novo item para o componente pai
  // Mantive a validação mínima que já existia (nome, preço e categoria obrigatórios)
  onSubmit(): void {
    // Validação mínima
    if (!this.newItem.nome || !this.newItem.preco || !this.newItem.categoria) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    
    // Transforma para o tipo MenuItem e envia
    this.itemAdded.emit(this.newItem as MenuItem);
  }

}

