import { registerAs } from '@nestjs/config';

export default registerAs('therapist', () => ({
    email: process.env.THERA_EMAIL?.toString() || 'therapist@example.com',
    password: process.env.THERA_PASSWORD?.toString() || 'defaultPassword123',
    firstName: process.env.THERA_FIRSTNAME?.toString() || 'Therapist',
    lastName: process.env.THERA_LASTNAME?.toString() || 'User',
    phoneNumber: process.env.THERA_PHONE?.toString() || '1234567890',
    dob: process.env.THERA_DOB?.toString() || '1985-01-01',
    country: process.env.THERA_COUNTRY?.toString() || 'USA',
    preferredLanguages: process.env.THERA_LANGUAGES?.split(',') || ['English'],
    preferredCurrency: process.env.THERA_CURRENCY?.toString() || 'USD',
    timeZone: process.env.THERA_TIMEZONE?.toString() || 'America/New_York',
    officeLocation: process.env.THERA_OFFICE?.toString() || 'New York, NY',
    workEmail: process.env.THERA_WORK_EMAIL?.toString() || 'therapist@example.com',
  }));