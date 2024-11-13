import { Component, OnInit } from '@angular/core';
import { GlobalEventsService } from 'src/app/services/global-events.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  public message: string;

  constructor( public gEv: GlobalEventsService) { }

  ngOnInit() {
    this.gEv.showAlert.subscribe( (message: string) => { this.message = message } );
  }//ngOnInit()


  closeMsg(){
    this.message = "";
  }//closeMsg()

}//class AlertComponent

