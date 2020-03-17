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
  selectedBranchIndex: number = 0;
  copiesData: any;
  totalCopies: number;
  isLoading = false;
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedIndex: any;
  pager: any = {
    pageSize: 10
  };
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
        this.setPage(1);
      }
    },
      error => {
        this.isLoading = false;
      }
    );
  }

  changeBranch(selectedIndex) {
    this.selectedBranchIndex = selectedIndex;
    this.setPage(1);
  }

  filterCopies() {
    this.filteredItems = this.copiesData.copies.filter(copy => copy.book.title.toLowerCase().includes(this.filterString.toLowerCase()));
    this.totalCopies = this.copiesData.count ? this.copiesData.count.value : 0;
  }

  filter() {
    this.filterCopies();
    this.setPage(this.pager.currentPage);
  }

  checkout() {
    let data = {
      borrowerId: this.borrowerService.borrower._id,
      branchId: this.filteredItems[this.selectedIndex].branch._id,
      bookId: this.filteredItems[this.selectedIndex].book._id
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
    this.selectedIndex = index;
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
    this.isLoading = true;
    this.borrowerService.getAll(`http://localhost:3000/branches/${this.branches[this.selectedBranchIndex]._id}/copies/skip/${this.pager.currentPage ? ((this.pager.currentPage - 1) * this.pager.pageSize) : 0}/limit/${this.pager.pageSize || 0}`).subscribe(res => {
      this.isLoading = false;
      this.copiesData = res;
      if (this.copiesData && this.copiesData.copies && this.copiesData.copies.length) {
        this.copiesData.copies = this.copiesData.copies.map(copy => {
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
        this.pager = this.pagerService.getPager(this.totalCopies, page, this.pager.pageSize);
        this.pagedItems = this.filteredItems;
      } else {
        this.filterCopies();
        this.pagedItems = [];
      }
    },
      error => {
        this.isLoading = false;
        this.copiesData = {
          copies: []
        };
        this.filterCopies();
        this.pagedItems = [];
      }
    );
  }
}
