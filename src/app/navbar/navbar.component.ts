import { Component, OnInit } from '@angular/core';
import { BorrowerService } from 'src/app/services/borrower.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private borrowerServ: BorrowerService) { }


  showLogout = this.borrowerServ.loggedIn.getValue();
  observer;

  ngOnInit() {
    this.observer = this.borrowerServ.loggedIn.subscribe(value => this.showLogout = value);
    console.log(this.showLogout);
  }

  logout() {
    this.borrowerServ.logout();
  }

}
