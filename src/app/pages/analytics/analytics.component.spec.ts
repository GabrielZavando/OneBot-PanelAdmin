import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Analytics } from './analytics.component';

describe('Analytics', () => {
  let component: Analytics;
  let fixture: ComponentFixture<Analytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render analytics title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Analítica');
  });
});
