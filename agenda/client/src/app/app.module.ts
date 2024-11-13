import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AddAgendaComponent } from './components/add-agenda/add-agenda.component';
import { AgendaListComponent } from './components/agenda-list/agenda-list.component';
import { AgendaItemComponent } from './components/agenda-item/agenda-item.component';
import { AlertComponent } from './components/alert/alert.component';


@NgModule({
  declarations: [
    AppComponent,
    AddAgendaComponent,
    AgendaListComponent,
    AgendaItemComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
