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
  login = () => {
    this.isLoading = true;
    //calls api for borrower
    this.borrowerServ.establishBorrower(this.inputId).subscribe(borrowerResp => {
      //if borrower is found set as active user
      if (borrowerResp.hasOwnProperty("name")) {
        this.borrowerServ.setBorrower(borrowerResp);
        this.borrowerServ.loggedIn.next(true);
        this.loginFailed = false;
        //sends to home page after logged in
        this.router.navigateByUrl("/home");
      } else {
        this.loginFailed = true;
      }
    }, error => {
      this.loginFailed = true;
    })

    this.isLoading = false;
  }
}
