import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';
import { GlobalEventsService } from 'src/app/services/global-events.service';
import Executer from 'src/app/models/executer';

@Component({
    selector: 'app-add-agenda',
    templateUrl: './add-agenda.component.html',
    styleUrls: ['./add-agenda.component.css']
})
export class AddAgendaComponent implements OnInit {
    public form: FormGroup;
    public arrExecuters: [Executer];

    constructor(
        public db: DbService,
        public gEv: GlobalEventsService,
        public fb: FormBuilder) { }


    ngOnInit() {
        this.form = this.fb.group({
            exec_id: ["", Validators.required],
            descr: ["", Validators.required]
          })//this.fb.group

          this.db.getFamily().subscribe(
            (res: [Executer]) => {
              console.log(res);
              this.arrExecuters = res;
              if (this.arrExecuters.length > 0) this.form.controls.exec_id.setValue(this.arrExecuters[0].id);
            },
            err => {
              console.log(err);
              alert("ERROR: " + err.error)
              this.gEv.doShowAlert(err.error);
              // this.msb.open(err.error, null, {duration: 4000});
            }
          )//this.db.getFamily().subscribe()

    }//ngOnInit()


    submitHandler(e) {
        e.preventDefault()
    
        this.db.addAgenda(this.form.value).subscribe(
          res => {
            this.gEv.doRefreshAgendas();
            this.form.reset();
          },
          err => {
            console.log("Add ERROR:", err, " >>> ", err.error);
            this.gEv.doShowAlert(err.error);
          }
          
        )//db.addAgenda().subscribe
      }//submitHandler
    

}//class AddAgendaComponent
