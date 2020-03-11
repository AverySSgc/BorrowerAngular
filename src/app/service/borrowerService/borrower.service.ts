import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {

  constructor() { }

  borrower = {
    ".id": null,
    "name": "Avery Corbett",
    "phone": null,
    "address": null
  }

  // getBorrower(inputId) {
  //   return this.http.get(`http://localhost:3000/${inputId}`);
  // }

  setBorrower(newBorrower) {
    this.borrower = newBorrower;
  }
}
