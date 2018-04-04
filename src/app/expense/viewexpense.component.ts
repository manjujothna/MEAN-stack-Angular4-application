import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from './ticket.service';
import { AuthService } from '../user/auth.service';
import { ToastrService } from '../common/toastr.service';
import { Subscription } from 'rxjs/Subscription';
import { ITicket } from './ticket';

@Component({
  templateUrl: './viewticket.component.html'
})

export class ViewticketComponent implements OnInit, OnDestroy {
  
  expense: ITicket;
  private sub: Subscription;

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.getTicket(id);
      });
    }

    ngOnDestroy() {
      this.sub.unsubscribe();
    }

    getTicket(id){
      this.ticketService.getTicket(id).subscribe(data => {
        if (data.success === false) {
          if (data.errcode){
            this.authService.logout();
            this.router.navigate(['login']);
          }
          this.toastr.error(data.message);
        } else {
          if (data.data[0]) {
            this.expense = data.data[0];
          } else {
            this.toastr.error('Expense id is incorrect in the URL');
          }
          
        }
      });
    }
    
    onBack(): void {
        this.router.navigate(['/report'], { preserveQueryParams: true });
    }
}
