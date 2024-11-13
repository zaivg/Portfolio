import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventsService {
  public RefreshAgendas: EventEmitter<number> = new EventEmitter<number>();
  public showAlert: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  
  public doRefreshAgendas(){
    console.log("===> doRefreshAgendas");
    this.RefreshAgendas.emit();
  }//doRefreshAgendas() 
  
  
  public doShowAlert(message: string){
    console.log("===> doRefreshMeetings=", message);
    this.showAlert.emit(message);
  }//doShowAlert()


}//class GlobalEventsService
