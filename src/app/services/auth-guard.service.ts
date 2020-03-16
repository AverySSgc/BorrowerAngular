import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { BorrowerService } from './borrower.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private borrowerService: BorrowerService, private router: Router) { }

  canActivate(): boolean {
    if (!this.borrowerService.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
