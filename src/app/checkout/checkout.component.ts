import { Component, OnInit } from '@angular/core';
import { BorrowerService } from '../services/borrower.service';
import { PagerService } from '../services/pager.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private borrowerService: BorrowerService, private modalService: NgbModal, private pagerService: PagerService) { }
  branches: any;
  copies: any;
  totalCopies: number;
  isLoading = false;
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedIndex: any;
  pager: any = {};
  pagedItems: any[];
  filterString = '';
  filteredItems: any[]

  ngOnInit() {
    this.getAllBranches();
  }

  getAllBranches() {
    this.isLoading = true;
    this.borrowerService.getAll('http://localhost:3000/branches').subscribe(res => {
      this.isLoading = false;
      this.branches = res;
      if (this.branches && this.branches.length) {
        this.getAllCopies(0);
      }
    },
      error => {
        this.isLoading = false;
      }
    );
  }

  getAllCopies(index) {
    this.isLoading = true;
    this.borrowerService.getAll(`http://localhost:3000/branches/${this.branches[index]._id}/copies`).subscribe(res => {
      this.isLoading = false;
      this.copies = res;
      this.copies = this.copies.map(copy => {
        return {
          book: {
            _id: copy.book._id,
            title: copy.book.title,
            authors: copy.book.authors.map(author => author.name),
            publisher: copy.book.publisher.name,
            genres: copy.book.genres.map(genre => genre.name)
          },
          branch: copy.branch,
          amount: copy.amount
        };
      });
      this.filterCopies();
      this.setPage(1);
    },
      error => {
        this.isLoading = false;
        this.copies = [];
        this.filterCopies();
        this.pagedItems = [];
      }
    );
  }

  filterCopies() {
    this.filteredItems = this.copies.filter(copy => copy.book.title.toLowerCase().includes(this.filterString.toLowerCase()));
    this.totalCopies = this.filteredItems.length;
  }

  filter() {
    this.filterCopies();
    this.setPage(this.pager.currentPage);
  }

  checkout() {
    let data = {
      borrowerId: this.borrowerService.borrower._id,
      branchId: this.copies[this.selectedIndex].branch,
      bookId: this.copies[this.selectedIndex].book._id
    };
    this.isLoading = true;
    this.borrowerService.post('http://localhost:3000/loans', data).subscribe(res => {
      this.isLoading = false;
      this.filteredItems[this.selectedIndex].amount--;
      if (!this.filteredItems[this.selectedIndex].amount) {
        this.filteredItems.splice(this.selectedIndex, 1);
        this.setPage(this.pager.currentPage);
      }
      this.modalRef.close();
    },
      error => {
        this.isLoading = false;
        this.modalRef.dismiss();
      }
    );
  }

  open(content, index) {
    this.selectedIndex = (this.pager.currentPage - 1) * this.pager.pageSize + index;
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      result => {
        this.errMsg = '';
        this.closeResult = `Closed with ${result}`;
      },
      reason => {
        this.errMsg = '',
          this.closeResult = `Dismissed`
      }
    )
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.copies.length, page, 10);
    this.pagedItems = this.filteredItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
