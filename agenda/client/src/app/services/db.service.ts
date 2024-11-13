import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const SERVER_ROOT: string = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(public http: HttpClient) { }

  /*** HTTP: ***/
  public getFamily() {
    return this.http.get(SERVER_ROOT + '/family');
  }//getFamily()


  public getAgendas() {
    return this.http.get(SERVER_ROOT + '/agendas');
  }//getAgendas()


  public addAgenda(agenda) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(SERVER_ROOT + '/agendas'
      , JSON.stringify(agenda)
      , { headers, responseType: 'text' }
    );
  }//addAgenda()


  public deleteAgenda(id: number) {
    return this.http.delete(SERVER_ROOT + '/agendas/' + id,
      { responseType: 'text' }
    );
  }//deleteAgenda()
  /*** end of HTTP ***/

}//class DbService
