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
  totalCopies: 0;
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedIndex: any;
  pager: any = {};
  pagedItems: any[];
  searchString = '';

  async ngOnInit() {
    this.getAllBranches();
  }

  getAllBranches() {
    this.borrowerService.getAll('http://localhost:3000/branches').subscribe(res => {
      this.branches = res;
      if (this.branches && this.branches.length) {
        this.getAllCopies(0);
      }
    });
  }

  getAllCopies(index) {
    this.borrowerService.getAll(`http://localhost:3000/branches/${this.branches[index]._id}/copies`).subscribe(res => {
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
      this.totalCopies = this.copies.length;
      this.setPage(1);
    });
  }

  checkout() {
    let data = {
      borrowerId: "5e66949385ed682e1800f4a2",
      branchId: this.copies[this.selectedIndex].branch,
      bookId: this.copies[this.selectedIndex].book._id
    };
    this.borrowerService.post('http://localhost:3000/loans', data).subscribe(res => {
      this.copies[this.selectedIndex].amount--;
      if (!this.copies[this.selectedIndex].amount) {
        this.copies.splice(this.selectedIndex, 1);
        this.setPage(this.pager.currentPage);
      }
    });
    this.modalRef.close();
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
    this.pager = this.pagerService.getPager(this.copies.length, page, 10);
    this.pagedItems = this.copies.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1,
    );
  }
}