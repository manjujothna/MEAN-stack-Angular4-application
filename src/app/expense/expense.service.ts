import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class TicketService {
    public appdomain: string ='http://localhost:3000';
    public jwtToken: string;

    constructor(private http: Http) {
        const theUser:any = JSON.parse(localStorage.getItem('currentUser'));
        if (theUser) {
            this.jwtToken = theUser.token;
        }
    }

    saveTicket(userid, oTicket){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });
                                      //CHANGE IN DEVELOPMENT MODE   !!!!!!!!!!!!!!!
        return this.http.post(`http://localhost:3000/api/ticket/${userid}`, JSON.stringify(oTicket), options)
             .map((response: Response) => response.json())
             .catch(this.handleError);

      //return this.http.post(`/api/expense/${userid}`, JSON.stringify(oExpense), options)
      //  .map((response: Response) => response.json())
      //  .catch(this.handleError);
    }

    getTicket(userid, oTicket) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

         return this.http.post(`http://localhost:3000/api/ticket/report/${userid}`, JSON.stringify(oTicket), options)
            .map((response: Response) => response.json())
             .catch(this.handleError);
    //  return this.http.post(`/api/ticket/report/${userid}`, JSON.stringify(oExpense), options)
      //  .map((response: Response) => response.json())
      //  .catch(this.handleError);
    }

    getTicketTotal(userid, oTicket) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:3000/api/ticket/total/${userid}`, JSON.stringify(oTicket), options)
           .map((response: Response) => response.json())
            .catch(this.handleError);
      //return this.http.post(`/api/expense/total/${userid}`, JSON.stringify(oExpense), options)
      //  .map((response: Response) => response.json())
      //  .catch(this.handleError);
    }

    getTicket(ticid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

         return this.http.get(`http://localhost:3000/api/ticket/${ticid}`, options)
           .map((response: Response) => response.json())
             .catch(this.handleError);
    //  return this.http.get(`/api/expense/${expid}`, options)
       // .map((response: Response) => response.json())
      //  .catch(this.handleError);
    }

    delTicket(ticid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(`http://localhost:3000/api/ticket/${ticid}`, options)
            .map((response: Response) => response.json())
           .catch(this.handleError);

    //  return this.http.delete(`/api/expense/${expid}`, options)
       // .map((response: Response) => response.json())
      //  .catch(this.handleError);
    }

     private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
