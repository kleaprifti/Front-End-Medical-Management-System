import { TestBed } from '@angular/core/testing';

import { SessionConfigService } from './session-config.service';

describe('SessionConfigService', () => {
  let service: SessionConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
