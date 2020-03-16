import { Component } from '@angular/core';
import { BorrowerService } from './services/borrower.service';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private borrowerServ: BorrowerService) { }
  title = 'borrower-lms';
  name = this.borrowerServ.borrower.name;
}
