import { TestBed } from '@angular/core/testing';

import { HttpWebService } from './http.web.service';

describe('Http.WebService', () => {
  let service: HttpWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
