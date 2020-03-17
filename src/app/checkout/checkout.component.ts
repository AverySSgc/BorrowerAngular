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
  copies: any = [];
  totalCopies: number;
  isLoading = false;
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  pager: any = {
    pageSize: 10,
    currentPage: 1
  };
  selectedBranchIndex: number = 0;
  selectedBookIndex: number = 0;
  selectedPageIndex: number = 1;
  searchString = '';

  ngOnInit() {
    this.getAllBranches();
  }

  getAllBranches() {
    this.isLoading = true;
    this.borrowerService.get('/branches').subscribe(res => {
      this.isLoading = false;
      this.branches = res;
      if (this.branches && this.branches.length) {
        this.getAllCopies();
      }
    },
      error => {
        this.isLoading = false;
      }
    );
  }

  getAllCopies() {
    let query = [];
    query.push({ pagesize: this.pager.pageSize });
    query.push({ page: this.pager.currentPage });
    if (this.searchString && this.searchString.length) {
      query.push({ title: this.searchString });
    }
    this.isLoading = true;
    this.borrowerService.query(`/branches/${this.branches[this.selectedBranchIndex]._id}/copies`, query).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.copies = res['copies'];
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
        this.totalCopies = res['count'];
        this.setPage(this.selectedPageIndex);
      } else {
        this.copies = [];
        this.totalCopies = 0;
      }
    },
      error => {
        this.isLoading = false;
      }
    );
  }

  changeBranch(selectedIndex) {
    this.selectedBranchIndex = selectedIndex;
    this.getAllCopies();
  }

  changePage(selectedIndex) {
    this.selectedPageIndex = selectedIndex;
    this.getAllCopies();
  }

  checkout() {
    let data = {
      borrowerId: this.borrowerService.borrower._id,
      branchId: this.copies[this.selectedBookIndex].branch._id,
      bookId: this.copies[this.selectedBookIndex].book._id
    };
    this.isLoading = true;
    this.borrowerService.post('/loans', data).subscribe(res => {
      this.isLoading = false;
      this.copies[this.selectedBookIndex].amount--;
      if (!this.copies[this.selectedBookIndex].amount) {
        this.copies.splice(this.selectedBookIndex, 1);
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
    this.selectedBookIndex = index;
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
    this.pager = this.pagerService.getPager(this.totalCopies, page, this.pager.pageSize);
  }
}
