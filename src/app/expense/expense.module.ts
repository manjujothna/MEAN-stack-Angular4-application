import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ReportComponent } from './report.component';
import { TicketComponent } from './ticket.component';
import { ViewticketComponent } from './viewticket.component';
import { AuthGuard } from '../user/auth-guard.service';
import { AuthService } from '../user/auth.service';
import { TicketService } from './ticket.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'report', canActivate: [ AuthGuard], component: ReportComponent },
      { path: 'ticket', canActivate: [ AuthGuard], component: TicketComponent },
      { path: 'ticket/:id', canActivate: [ AuthGuard], component: TicketComponent },
      { path: 'ticket/view/:id', canActivate: [ AuthGuard], component: ViewticketComponent }
    ])
  ],
  declarations: [
    ReportComponent,
    TicketComponent,
    ViewticketComponent
  ],
  providers: [
    DatePipe,
    AuthService,
    AuthGuard,
    TicketService
  ]
})
export class TicketModule {}
