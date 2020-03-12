import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BorrowerService } from 'src/app/services/borrower.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private borrowerServ: BorrowerService, private router: Router) { }

  inputId = '';

  ngOnInit() {
    if (this.borrowerServ.loggedIn)
      this.router.navigateByUrl("/home")
  }

  loginFailed = false;
  isLoading = false;


  login = async () => {
    this.isLoading = true;
    try {
      let borrowerResp = await this.borrowerServ.establishBorrower(this.inputId);

      if (borrowerResp.hasOwnProperty("name")) {
        this.borrowerServ.setBorrower(borrowerResp);
        this.borrowerServ.loggedIn = true;
        this.loginFailed = false;
      } else {
        throw "error";
      }
      this.router.navigateByUrl("/home")
    } catch (err) {
      this.loginFailed = true;
    } finally {
      console.log("loginFailed: " + this.loginFailed);
      console.log("Borrower Id: " + this.borrowerServ.borrower._id);
      console.log("Borrower name: " + this.borrowerServ.borrower.name);

      this.isLoading = false;
    }
  }



}
