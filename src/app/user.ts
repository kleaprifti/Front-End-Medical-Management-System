export interface User {
    id: number;
    fullName: string;
    roles: UserRole[];
    specialities: string[];
  }
  
  export enum UserRole {
    DOCTOR = 'DOCTOR',
  }