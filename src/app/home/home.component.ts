import { Component, OnInit } from '@angular/core';
import { BorrowerService } from '../services/borrower.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  borrower: any = null;

  constructor(private borrowerService: BorrowerService) { }

  ngOnInit() {
    this.borrower = this.borrowerService.borrower;
  }

}
