import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-select-route',
  standalone: true,
  imports: [CommonModule, NgSelectModule],
  templateUrl: './select-route.component.html',
  styleUrls: ['./select-route.component.scss'],
})
export class SelectRouteComponent {}
