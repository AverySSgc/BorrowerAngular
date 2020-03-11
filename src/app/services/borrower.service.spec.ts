import { TestBed } from '@angular/core/testing';

import { BorrowerService } from './borrower.service';

describe('BorrowerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BorrowerService = TestBed.get(BorrowerService);
    expect(service).toBeTruthy();
  });
});
