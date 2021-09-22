import { TestBed } from '@angular/core/testing';

import { Http.NativeService } from './http.native.service';

describe('Http.NativeService', () => {
  let service: Http.NativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Http.NativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
