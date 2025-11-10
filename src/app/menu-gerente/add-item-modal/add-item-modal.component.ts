import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { trigger, transition, style, animate } from '@angular/animations';
import { MenuItem } from '../overview/overview.component'; // Importa a interface

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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Atualiza o campo de texto (URL da imagem) com o nome do arquivo.
      this.newItem.foto = 'Arquivo: ' + file.name;
      
      console.log('Arquivo selecionado:', file.name);
    }

  }
  onCancel(): void {
    this.close.emit();
  }

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

