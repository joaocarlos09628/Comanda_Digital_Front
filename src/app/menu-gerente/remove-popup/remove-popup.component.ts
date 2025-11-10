import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-remove-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './remove-popup.component.html',
  styleUrls: ['./remove-popup.component.css']
})
export class RemovePopupComponent {
  @Input() itemName: string = 'este item'; // Nome do item para exibição
  @Output() close = new EventEmitter<void>();
  @Output() confirmRemove = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmRemove.emit();
  }

  onCancel(): void {
    this.close.emit();
  }
}
