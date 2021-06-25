import { TestBed } from '@angular/core/testing';

import { AgoraRTCService } from './agora-rtc.service';

describe('AgoraRTCService', () => {
  let service: AgoraRTCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgoraRTCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
