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

  getBorrower(inputId) {
    return this.http.get(`http://localhost:3000/borrowers/${inputId}`);
  }

  setBorrower(newBorrower) {
    this.borrower = newBorrower;
  }
}
