import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {

  constructor(private http: HttpClient) { }

  borrower = {
    ".id": null,
    "name": null,
    "phone": null,
    "address": null
  }

  establishBorrower(inputId) {
    return this.http.get(`http://localhost:3000/borrowers/${inputId}`);
  }

  getBorrower() {
    return this.borrower;
  }

  setBorrower(newBorrower) {
    this.borrower = newBorrower;
  }

  getAll(url) {
    return this.http.get(url);
  }

  post(url, obj) {
    return this.http.post(url, obj);
  }
}
