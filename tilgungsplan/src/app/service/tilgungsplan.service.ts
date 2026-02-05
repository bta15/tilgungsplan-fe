import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {TilgungsplanResponse} from "../entity/tilgungsplan-response";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {TilgungsplanRequest} from "../entity/tilgungsplan-request";

@Injectable({
  providedIn: 'root'
})
export class TilgungsplanService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  getTilgungsplan(tilgungsplanRequest: TilgungsplanRequest): Observable<TilgungsplanResponse> {
    return this.http.post<TilgungsplanResponse>("http://localhost:8080/tilgungsplan", tilgungsplanRequest, this.httpOptions)
  }
}
