import { SessionTimeoutService } from './session-timeout.service';
import { UserActivityDirective } from './user-activity.directive';

describe('UserActivityDirective', () => {
  it('should create an instance', () => {
    // Create a mock SessionService
    const mockSessionService = jasmine.createSpyObj('SessionService', ['onUserActivity']);

    // Pass the mock SessionService to the directive constructor
    const directive = new UserActivityDirective(mockSessionService as SessionTimeoutService);
    expect(directive).toBeTruthy();
  });
});