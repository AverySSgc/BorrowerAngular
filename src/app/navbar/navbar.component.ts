import { Component, OnInit } from '@angular/core';
import { BorrowerService } from 'src/app/services/borrower.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private borrowerServ: BorrowerService, private router: Router) { }


  showLogout = this.borrowerServ.loggedIn.getValue();
  observer;

  ngOnInit() {
    this.observer = this.borrowerServ.loggedIn.subscribe(value => this.showLogout = value);
  }

  logout() {
    this.borrowerServ.logout();
    this.router.navigateByUrl("/login");

  }

}
