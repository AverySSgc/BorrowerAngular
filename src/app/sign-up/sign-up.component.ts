import { Component, OnInit } from '@angular/core';
import { BorrowerService } from '../services/borrower.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private borrowerServ: BorrowerService, private router: Router) { }

  User = {
    "name": '',
    "phone": '',
    "address": ''
  }


  isLoading = false;
  signUpError = false;

  ngOnInit() {
  }

  signUp = async () => {
    this.isLoading = true;
    try {
      let newUser = await this.borrowerServ.registerBorrower(this.User);
      if (!newUser.hasOwnProperty("_id"))
        throw "error in signup";
      this.borrowerServ.setBorrower(newUser);
      this.router.navigateByUrl("/home");
    } catch (err) {
      this.signUpError = true;
    }
  }

}
