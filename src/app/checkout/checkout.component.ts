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

  ngOnInit() {
    this.getAllBranches().then(() => {
      if (this.branches && this.branches.length) {
        this.getAllCopies(0);
      }
    });
  }

  getAllBranches() {
    return new Promise((resolve, reject) => {
      this.borrowerService.getAll('http://localhost:3000/branches').subscribe(res => {
        if (res) {
          this.branches = res;
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  getAllCopies(index) {
    return new Promise((resolve, reject) => {
      this.borrowerService.getAll(`http://localhost:3000/branches/${this.branches[index]._id}/copies`).subscribe(res => {
        if (res) {
          this.copies = res;
          this.copies = this.copies.map(copy => {
            return {
              book: {
                title: copy.book.title,
                authors: copy.book.authors.map(author => author.name),
                publisher: copy.book.publisher.name,
                genres: copy.book.genres.map(genre => genre.name)
              },
              amount: copy.amount
            };
          });
          // this.copies = Array.apply(null, Array(200)).map((i, j) => {
          //   return {
          //     book: {
          //       title: `title${j + 1}`,
          //       authors: `author${j + 1}`,
          //       publisher: `publisher${j + 1}`,
          //       genres: `genre${j + 1}`
          //     },
          //     amount: Math.floor(Math.random() * 10) % 2
          //   };
          // });
          this.totalCopies = this.copies.length;
          this.setPage(1);
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  checkout() {
    console.log(this.selectedIndex);
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