import { TestBed } from '@angular/core/testing'

import { LiveConnectionService } from './live-connection.service'

describe('LiveConnectionService', () => {
  let service: LiveConnectionService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LiveConnectionService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
