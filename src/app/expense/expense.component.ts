import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from '../common/toastr.service'
import { TicketService } from './ticket.service';
import { AuthService } from '../user/auth.service';

@Component({
  templateUrl: './expense.component.html'
})

export class TicketComponent implements OnInit {
  
  ticketForm: FormGroup;
  userObj: any;
  ticsubject:string;
  ticdesc: string;
  
  admin: any = ['manju22pavi@gmail.com', 'remijeous@gmaiil.com', 'chiarro2016@gmail.com', 'sbarunshankar@gmail.com', 'jaya1995rithan@gmail.com', 'karthick1997bhel@gmail.com', 'pavi22@gmail.com', 'poornimanarayanan@gmail.com'];
  issuses:any =['network problem','virus attack','system resource failiure','others'];
  tags:any=['test tag','risk','code debug','others'];
  ticid: string;
  pgTitle: string;
  btnLbl: string;

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
    ) {
  }
ticsubject= new FormControl();
   ticdesc = new FormControl();
  ticadmin = new FormControl('', [Validators.required]);
   ticissuse = new FormControl('', [Validators.required]);
  tictags = new FormControl('', [Validators.required]);
  
 

  ngOnInit(){
    
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.ticid = params['id'];
        this.getTicket(this.ticid);
        this.pgTitle = "Edit";
        this.btnLbl = "Update"
      } else {
        this.pgTitle = "Add";
        this.btnLbl = "Submit"
      }
    });
    
    this.userObj =  this.authService.currentUser;
    this.ticketForm = this.fb.group({
      ticsubject:this.ticsubject,
      expdesc: this.expdesc,
       ticadmin: this.ticadmin,
       ticissuse: this.ticissuse,
       tictags: this.tictags,
      
    });
  }

  getTicket(id){
    this.ticketService.getTicket(id).subscribe(data => {
      if (data.success === true) {
        if (data.data[0]) {
          this.populateForm(data.data[0]);
        } else {
          this.toastr.error('Ticket id is incorrect in the URL');
          this.router.navigate(['report']);
        }
      }
    });
  }

  populateForm(data): void {
    this.ticketForm.patchValue({
      
      ticadmin: data.tickettype,
      ticsubject: data.ticketsubject,
      ticdesc: data.ticketdesc,
    ticissuse:data.ticketissuse,
    tictags:data.tickettags
    });
  }

  saveTicket(formdata:any): void {
    if (this.ticketForm.valid) {
      const theForm = this.ticketForm.value;
      if (this.ticid !== '') {
        theForm.ticid = this.ticid;
      }
      
      this.ticketService.saveTicket(this.userObj.userid,theForm)
        .subscribe(data => {
          if (data.success === false) {
            if (data.errcode){
              this.authService.logout();
              this.router.navigate(['login']);
            }
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
          }
          if (!this.ticid) {
            this.ticketForm.reset();
          }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/report'], { preserveQueryParams: true });
  }

}
