import { PhoneNumberUtil } from 'google-libphonenumber';

import { ParseResponse, PhoneNumber, ValidationResult } from './entities';
import { mapGoogleReason } from './mapper';
const phoneUtil = PhoneNumberUtil.getInstance();

export class GooglePhoneNumber {
  public static isPossibleNumberWithReason(phoneNumber: PhoneNumber) {
    const isPossibleReason = phoneUtil.isPossibleNumberWithReason(phoneNumber);
    return mapGoogleReason[isPossibleReason];
  }

  public static parse(phoneNumber: string, region?: string): ParseResponse {
    try {
      const parsed = phoneUtil.parse(phoneNumber, region);
      return { phoneNumber: parsed, state: GooglePhoneNumber.isPossibleNumberWithReason(parsed) };
    } catch (error) {
      return { state: ValidationResult.INPUT_IS_NOT_A_PHONE_NUMBER };
    }
  }
}
