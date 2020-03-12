import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {

  constructor(private http: HttpClient) { }

  //borrower object
  borrower = {
    "_id": null,
    "name": null,
    "phone": null,
    "address": null
  }

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  //gets borrower info from api
  establishBorrower(inputId) {
    return this.http.get(`http://localhost:3000/borrowers/${inputId}`).toPromise();
  }

  //gets active borrower
  getBorrower() {
    return this.borrower;
  }
  //sets the new active borrower
  setBorrower(newBorrower) {
    this.borrower = newBorrower;
  }
  //logout funtions
  logout() {
    this.setBorrower(undefined);
    this.loggedIn.next(false);
  }
}
