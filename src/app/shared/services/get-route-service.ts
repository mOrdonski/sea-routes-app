import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { routesMock } from '../data/routes.mock';
import { RouteDto } from '../interfaces/route.dto';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  // TODO: change to real API call
  get(id: number): Observable<RouteDto | null> {
    const route = routesMock.find((route) => route.route_id === id) || null;
    if (!route) {
      return of(null);
    }
    return of(route);
  }

  getFromToPorts(): Observable<{ from: string; to: string; id: number }[]> {
    const fromToPorts = routesMock.map((route) => {
      return {
        from: route.from_port,
        to: route.to_port,
        label: `${route.from_port} - ${route.to_port}`,
        id: route.route_id,
      };
    });

    return of(fromToPorts);
  }
}
