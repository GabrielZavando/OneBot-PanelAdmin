import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Redirector } from './redirector.component';
import { AuthService } from '../../services/auth.service';

describe('Redirector', () => {
  let component: Redirector;
  let fixture: ComponentFixture<Redirector>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuth: jasmine.SpyObj<Auth>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authSpy = jasmine.createSpyObj('Auth', ['currentUser']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [Redirector],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Auth, useValue: authSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAuth = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    fixture = TestBed.createComponent(Redirector);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should redirect to dashboard when user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    fixture = TestBed.createComponent(Redirector);
    component = fixture.componentInstance;
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to register when user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    fixture = TestBed.createComponent(Redirector);
    component = fixture.componentInstance;
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });
});
