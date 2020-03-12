import { Component, OnInit } from '@angular/core';
import { BorrowerService } from 'src/app/services/borrower.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

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
    this.observer = this.borrowerServ.loggedIn.subscribe(value => { this.showLogout = value; console.log(this.borrowerServ.borrower); });
    console.log(this.showLogout);
  }

  logout() {
    this.borrowerServ.logout();
    console.log(this.borrowerServ.borrower)
  }

}
