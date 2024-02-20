import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WebsocketReceiverComponent } from './websocket-receiver.component'

describe('WebsocketReceiverComponent', () => {
  let component: WebsocketReceiverComponent
  let fixture: ComponentFixture<WebsocketReceiverComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsocketReceiverComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(WebsocketReceiverComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
