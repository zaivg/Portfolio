import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { GlobalEventsService } from 'src/app/services/global-events.service';
import Agenda from 'src/app/models/agenda';

@Component({
  selector: 'app-agenda-item',
  templateUrl: './agenda-item.component.html',
  styleUrls: ['./agenda-item.component.css']
})
export class AgendaItemComponent implements OnInit {
    @Input()
    public agenda: Agenda;

  constructor(
    public db: DbService,
    public gEv: GlobalEventsService) { }

  ngOnInit() {
  }

  deleteAgenda() {
    this.db.deleteAgenda(this.agenda.id).subscribe(
      res => {
        this.gEv.doRefreshAgendas();
      },
      err => {
        console.log("Delete ERROR:", err, " >>> ", err.error);
        this.gEv.doShowAlert(err.error);
        ///this.msb.open(err.error, null, { duration: 4000 });
      }
    )//db.deleteAgenda().subscribe
  }//deleteAgenda()


}//class AgendaItemComponent
