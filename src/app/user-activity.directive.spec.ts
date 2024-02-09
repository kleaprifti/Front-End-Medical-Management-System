import { SessionTimeoutService } from './session-timeout.service';
import { UserActivityDirective } from './user-activity.directive';

describe('UserActivityDirective', () => {
  it('should create an instance', () => {
    const mockSessionService = jasmine.createSpyObj('SessionService', ['onUserActivity']);
    const directive = new UserActivityDirective(mockSessionService as SessionTimeoutService);
    expect(directive).toBeTruthy();
  });
});