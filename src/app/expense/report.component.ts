import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from '../common/toastr.service'
import { TicketService } from './ticket.service';
import { AuthService } from '../user/auth.service';
import { ITicket } from './ticket';

@Component({
  templateUrl: './report.component.html'
})

export class ReportComponent implements OnInit {

  reportForm: FormGroup
  userObj: any;
  reportTitle: string;
  ticket: ITicket[];
  totalrows: number;
  pgCounter: number;
  qreport: string;
 qpage: number;
  qsort: string;
  tictotal: number;
  
  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
              ) {
  }

  report = new FormControl('opt1');
  

  ngOnInit(){
    this.userObj =  this.authService.currentUser;
    this.reportForm = this.fb.group({
      report: this.report
    });

    this.route.queryParams.forEach((params: Params) => {
      this.qreport = params['report'] || '';
      this.qpage = params['page'] || '';
      this.qsort = params['sortby'] || '';

      if(this.qreport !== '') {
        let payload: any = {};
        payload.report = this.qreport;
       
        payload.page = this.qpage;
        payload.sortby = this.qsort;
        this.fetchReport(this.userObj.userid, payload);

        this.reportForm.patchValue({
          report: this.qreport
        });
      }
    })

    
  }

  
  getReport(formdata:any): void {
    if (this.reportForm.valid) {
      if (this.reportForm.value.report === 'opt2'){
        this.toastr.error('Start date cannot be greater than end date.');
      } else {
        this.fetchReport(this.userObj.userid, this.reportForm.value);
      }
    }
  }

  fetchReport(userid, formval) {
    this.ticketService.getTicket(userid, formval)
    .subscribe(data => {
      if (data.success === false) {
        if (data.errcode){
          this.authService.logout();
          this.router.navigate(['login']);
        }
        this.toastr.error(data.message);
      } else {
        this.ticket = data.data.docs;
        this.totalrows = +data.data.total;
        this.pgCounter = Math.floor((this.totalrows + 10 - 1) / 10);
        
        this.qreport = formval.report;
              
        this.expenseService.getExpenseTotal(userid, formval)
        .subscribe(data => {
          this.exptotal = data.data[0];
        });

        if (formval.report === 'opt1') {
          this.reportTitle = 'for ' );
        } else if (formval.report === 'opt2') {
            this.reportTitle = 'between ' );
        } else {
          this.reportTitle = 'for all tickets'
        }
      }
    });
  }

  setPage(page): void {
    this.router.navigate(['report'],
      {
        queryParams: { report: this.qreport,  page: page, sortby: this.qsort }
      }
    );
  }

  createPager(number) {
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  showTicket(ticid): void {
    this.router.navigate([`ticket/view/${ticid}`],
      {
        queryParams: { report: this.qreport, page: this.qpage || 1, sortby: this.qsort }
      }
    );
  }

  confirmDel(idx: number, ticid: string) {
    if(confirm('Do you really want to delete this record?')){
      this.ticketService.delTicket(ticid)
      .subscribe(data => {
        if (data.success === false) {
          if (data.errcode){
            this.authService.logout();
            this.router.navigate(['login']);
          }
          this.toastr.error(data.message);
        } else {
          
          this.ticket.splice(idx, 1);
          
          this.toastr.success(data.message);
        }
      });
    }
  }

  editTicket(ticid): void {
    this.router.navigate([`ticket/${ticid}`],
      {
        queryParams: { report: this.qreport, page: this.qpage || 1, sortby: this.qsort }
      }
    );
  }

  sortTicket(sortby): void {
    if (this.qsort === ''){
      this.qsort = sortby;
    } else if (this.qsort.indexOf('-') > -1 ) {
      this.qsort = sortby;
    } else {
      this.qsort = '-' + sortby;
    }
  
    this.router.navigate(['report'],
      {
        queryParams: { report: this.qreport, page: this.qpage || 1, sortby: this.qsort }
      }
    );
  }
  
}
