import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import * as L from 'leaflet';
import { filter, map, Subject, switchMap } from 'rxjs';

import { ChartComponent } from '../chart/chart.component';
import { SelectRouteComponent } from '../select-route/select-route.component';
import { RouteDto } from '../shared/interfaces/route.dto';
import { SelectRouteDto } from '../shared/interfaces/selectRoute.dto';
import { RoutesService } from '../shared/services/get-route-service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, SelectRouteComponent, ChartComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private readonly routesService = inject(RoutesService);

  private map!: L.Map;
  private centroid: L.LatLngExpression = [0, 0];
  private layerGroup = new L.FeatureGroup();

  chartCategories: WritableSignal<string[]> = signal<string[]>([]);
  chartData: WritableSignal<number[]> = signal<number[]>([]);

  selectedRoute$: Subject<number> = new Subject<number>();

  drawRoute$ = this.selectedRoute$.pipe(
    switchMap((id) => this.routesService.get(id)),
    filter(Boolean),
    map((route: RouteDto) => {
      this.clearCurrentLayers();
      this.createChartData(route);
      this.createNewRoute(route);
      this.centerMapToRoute();
    })
  );

  centerMapToRoute(): void {
    const bounds = this.layerGroup.getBounds();
    this.map.fitBounds(bounds);
  }

  createNewRoute(route: RouteDto) {
    const points = this.getRoutePoints(route);
    const polylines = points.map((point: any[], index: number) => {
      const [lat, lng, color] = point;
      const nextPoint = points[index + 1];
      if (!nextPoint) {
        return;
      }
      const [nextLat, nextLng] = nextPoint;
      const polyline = new L.Polyline(
        [
          [lat, lng],
          [nextLat, nextLng],
        ],
        {
          color,
          weight: 3,
          opacity: 0.5,
          smoothFactor: 1,
        }
      );
      this.layerGroup.addLayer(polyline);
    });
  }

  clearCurrentLayers(): void {
    this.layerGroup.clearLayers();
    this.map.addLayer(this.layerGroup);
  }

  selectedRouteChanged(event: SelectRouteDto): void {
    if (!event?.id) {
      this.clearCurrentLayers();
      this.map.setView(this.centroid, 1);
      return;
    }
    const { id } = event;
    this.selectedRoute$.next(id);
  }

  getRoutePoints(route: RouteDto): any[] {
    const meanSpeed =
      route.points.reduce((acc: number, point: number[]) => {
        const [lng, lat, time, speed] = point;
        return acc + speed;
      }, 0) / route.points.length;

    return route.points.map((point: number[]) => {
      const [lng, lat, time, speed] = point;
      const color = speed > meanSpeed ? 'green' : 'red';
      return [lat, lng, color];
    });
  }

  createChartData(route: RouteDto): void {
    this.chartCategories.set(this.getChartCategories(route));
    this.chartData.set(this.getChartData(route));
  }

  getChartCategories(route: RouteDto): string[] {
    return route.points.map((point: number[]) => {
      const [lng, lat, time, speed] = point;
      const date = new Date(time).toLocaleDateString('pl-PL').toString();

      return date;
    });
  }

  getChartData(route: RouteDto): number[] {
    return route.points.map((point: number[]) => {
      const [lng, lat, time, speed] = point;
      return speed;
    });
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
