import { TestBed } from '@angular/core/testing';

import { GisApiService } from './gis-api.service';

describe('GisApiService', () => {
  let service: GisApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GisApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
