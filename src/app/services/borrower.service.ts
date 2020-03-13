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

  //use .getValue() to get the boolean and .next('newinput') to change it
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isLoggedIn() {
    return this.loggedIn.getValue();
  }

  setLoggedIn(input: boolean) {
    this.loggedIn.next(input);
  }

  //gets borrower info from api
  establishBorrower(inputId) {
    return this.http.get(`http://localhost:3000/borrowers/${inputId}`).toPromise();
  }

  //registers new borrower and returns the promise of a new borrower
  registerBorrower(newBorrower) {
    return this.http.post(`http://localhost:3000/borrowers`, newBorrower).toPromise();
  }

  //gets active borrower
  getBorrower() {
    return this.borrower;
  }
  //sets the new active borrower
  setBorrower(newBorrower) {
    this.borrower = newBorrower;
    this.loggedIn.next(true);
  }

  getAll(url) {
    return this.http.get(url);
  }

  post(url, obj) {
    return this.http.post(url, obj);
  }

  //logout funtions
  logout() {
    this.setBorrower(undefined);
    this.loggedIn.next(false);
  }
}
