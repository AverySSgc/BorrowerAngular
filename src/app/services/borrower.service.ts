import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {

  constructor(private http: HttpClient) { }

  borrower = {
    "_id": null,
    "name": null,
    "phone": null,
    "address": null
  }
  loggedIn = false;

  establishBorrower(inputId) {
    return this.http.get(`http://localhost:3000/borrowers/${inputId}`).toPromise();
  }

  getBorrower() {
    return this.borrower;
  }

  setBorrower(newBorrower) {
    this.borrower = newBorrower;
  }

  logout() {
    this.setBorrower(undefined);
    this.loggedIn = false;
  }
}
