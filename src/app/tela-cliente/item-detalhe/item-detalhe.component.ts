import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-detalhe',
  standalone: true,
  imports: [],
  templateUrl: './item-detalhe.component.html',
  styleUrl: './item-detalhe.component.css'
})
export class ItemDetalheComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
