import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { GlobalEventsService } from 'src/app/services/global-events.service';
import Agenda from 'src/app/models/agenda';

@Component({
    selector: 'app-agenda-list',
    templateUrl: './agenda-list.component.html',
    styleUrls: ['./agenda-list.component.css']
})
export class AgendaListComponent implements OnInit {
    public arrAgendas: [Agenda];

    constructor(public db: DbService,
        public gEv: GlobalEventsService) { }

        
    refreshAgendas() {
        this.db.getAgendas().subscribe(
            (res: [Agenda]) => {
                console.log("Agenda list:", res);
                this.arrAgendas = res;
            },
            err => {
                console.log(err);
                alert("ERROR: " + err.error)
                this.gEv.doShowAlert(err.error);
                // this.msb.open(err.error, null, {duration: 4000});
            }
        )//db.getAgendas
    }//refreshAgendas()


    ngOnInit() {
        this.refreshAgendas();
        this.gEv.RefreshAgendas.subscribe(() => {
            console.log(" >>>>>>> list: refreshAgendas");
            this.refreshAgendas();
        });//gEv.RefreshAgendas.subscribe()
    }//ngOnInit()

} //class AgendaListComponent
