import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { SelectRouteDto } from '../shared/interfaces/selectRoute.dto';
import { RoutesService } from '../shared/services/get-route-service';

@Component({
  selector: 'app-select-route',
  standalone: true,
  imports: [CommonModule, NgSelectModule],
  templateUrl: './select-route.component.html',
  styleUrls: ['./select-route.component.scss'],
})
export class SelectRouteComponent {
  @Output() readonly routeChanged: EventEmitter<SelectRouteDto> =
    new EventEmitter<SelectRouteDto>();

  private readonly routesService = inject(RoutesService);

  routes$ = this.routesService.getRoutes();
}
