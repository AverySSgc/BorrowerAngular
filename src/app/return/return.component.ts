import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BorrowerService } from '../services/borrower.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit, OnDestroy {

  constructor(private borrowerService: BorrowerService, private modalService: NgbModal) { }

  loans = [];
  numLoans: number;
  totalPages: number;
  isLoading = false;
  currentPage = 1;
  currentIndex = 1;
  loansPerPage = 10;
  private loansSub: Subscription;
  private modalRef: NgbModalRef;
  selectedIndex: number;

  ngOnInit() {
    this.isLoading = true;
    this.borrowerService.getLoans(this.loansPerPage, this.currentPage);
    this.loansSub = this.borrowerService.getLoansUpdateListener()
      .subscribe((loanData: { loans: any[], numLoans: number }) => {
        this.isLoading = false;
        this.loans = loanData.loans;
        this.numLoans = loanData.numLoans;
        this.currentIndex = (this.currentPage - 1) * this.loansPerPage;
        this.totalPages = Math.ceil(this.numLoans / this.loansPerPage);
      });
  }

  ngOnDestroy() {
    this.loansSub.unsubscribe();
  }

  onReturnBook() {
    this.isLoading = true;
    let loanId = this.loans[this.selectedIndex].id;
    this.borrowerService.returnBook(loanId).subscribe(() => {
      this.modalRef.close();
      this.borrowerService.getLoans(this.loansPerPage, this.currentPage);
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.borrowerService.getLoans(this.loansPerPage, this.currentPage);
    this.currentIndex = (this.currentPage - 1) * this.loansPerPage;
  }

  open(content: any, index: number) {
    this.selectedIndex = index;
    this.modalRef = this.modalService.open(content);
  }

}
