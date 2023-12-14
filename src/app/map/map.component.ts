import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { map, Subject } from 'rxjs';

import { SelectRouteComponent } from '../select-route/select-route.component';
import { SelectRouteDto } from '../shared/interfaces/selectRoute.dto';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, SelectRouteComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private centroid: L.LatLngExpression = [0, 0];

  selectedRoute$: Subject<number> = new Subject<number>();

  selectedRouteChanged(event: SelectRouteDto): void {
    const { id } = event;
    this.selectedRoute$.next(id);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap = (): void => {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 1,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 16,
        minZoom: 3,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  };
}
