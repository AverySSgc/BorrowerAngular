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

  allLoans = [];
  loans = [];
  totalLoans: number;
  totalPages: number;
  isLoading = false;
  currentPage = 1;
  currentIndex = 1;
  loansPerPage = 10;
  private loansSub: Subscription;
  private modalRef: NgbModalRef;
  errMsg: string;
  closeResult: string;
  selectedIndex: number;

  ngOnInit() {
    this.isLoading = true;
    this.borrowerService.getLoans();
    this.loansSub = this.borrowerService.getLoansUpdateListener()
      .subscribe((loanData: { loans: any[] }) => {
        this.isLoading = false;
        this.allLoans = loanData.loans;
        this.totalLoans = this.allLoans.length;
        this.loans = this.allLoans.slice((this.currentPage - 1) * this.loansPerPage,
          this.currentPage * this.loansPerPage);
        this.currentIndex = (this.currentPage - 1) * this.loansPerPage;
        this.totalPages = Math.ceil(this.totalLoans / this.loansPerPage);
      });
  }

  ngOnDestroy() {
    this.loansSub.unsubscribe();
  }

  onReturnBook() {
    this.isLoading = true;
    let loanId = this.allLoans[this.selectedIndex]._id;
    this.borrowerService.returnBook(loanId).subscribe(() => {
      this.modalRef.close();
      this.borrowerService.getLoans();
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.loans = this.allLoans.slice((this.currentPage - 1) * this.loansPerPage,
      this.currentPage * this.loansPerPage);
    this.currentIndex = (this.currentPage - 1) * this.loansPerPage;
  }

  open(content: any, index: number) {
    this.selectedIndex = index;
    this.modalRef = this.modalService.open(content);
  }

}
