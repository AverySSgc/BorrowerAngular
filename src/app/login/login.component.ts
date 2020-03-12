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
    //reroutes user to home if already logged in
    if (this.borrowerServ.loggedIn.getValue())
      this.router.navigateByUrl("/home");
  }

  //used to give error message to user
  loginFailed = false;
  //used to generate loading wheel
  isLoading = false;

  //function for logging in
  login = async () => {
    this.isLoading = true;
    try {
      //calls api for borrower
      let borrowerResp = await this.borrowerServ.establishBorrower(this.inputId);

      //if borrower is found set as active user
      if (borrowerResp.hasOwnProperty("name")) {
        this.borrowerServ.setBorrower(borrowerResp);
        this.borrowerServ.loggedIn.next(true);
        this.loginFailed = false;
      } else {
        throw "error";
      }
      //sends to home page after logged in
      this.router.navigateByUrl("/home")
    } catch (err) {
      this.loginFailed = true;
    } finally {
      this.isLoading = false;
    }
  }



}
