export type PhoneNumber = libphonenumber.PhoneNumber;

export enum ValidationResult {
  /** The number length matches that of valid numbers for this region. */
  IS_POSSIBLE = 'IS_POSSIBLE',

  /** The number has an invalid country calling code. */
  INVALID_COUNTRY_CODE = 'INVALID_COUNTRY_CODE',

  /** The number is shorter than all valid numbers for this region. */
  TOO_SHORT = 'TOO_SHORT',

  /** The number is longer than all valid numbers for this region. */
  TOO_LONG = 'TOO_LONG',

  /**
   * The number length matches that of local numbers for this region only (i.e.
   * numbers that may be able to be dialled within an area, but do not have all
   * the information to be dialled from anywhere inside or outside the country).
   */
  IS_POSSIBLE_LOCAL_ONLY = 'IS_POSSIBLE_LOCAL_ONLY',

  /**
   * The number is longer than the shortest valid numbers for this region,
   * shorter than the longest valid numbers for this region, and does not itself
   * have a number length that matches valid numbers for this region.
   * This can also be returned in the case where
   * isPossibleNumberForTypeWithReason was called, and there are no numbers of
   * this type at all for this region.
   */
  INVALID_LENGTH = 'INVALID_LENGTH',

  INPUT_IS_NOT_A_PHONE_NUMBER = 'INPUT_IS_NOT_A_PHONE_NUMBER',
}

export interface ParseResponse {
  phoneNumber?: PhoneNumber | null;
  state: ValidationResult;
}
