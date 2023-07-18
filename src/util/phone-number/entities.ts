export enum PhoneNumberFormat {
  E164 = 'E164',
  INTERNATIONAL = 'INTERNATIONAL',
  NATIONAL = 'NATIONAL',
  RFC3966 = 'RFC3966',
}

export enum CountryCodeSource {
  FROM_NUMBER_WITH_PLUS_SIGN = 1,
  FROM_NUMBER_WITH_IDD = 5,
  FROM_NUMBER_WITHOUT_PLUS_SIGN = 10,
  FROM_DEFAULT_COUNTRY = 20,
}

export enum PhoneNumberType {
  FIXED_LINE = 0,
  MOBILE = 1,
  FIXED_LINE_OR_MOBILE = 2,
  TOLL_FREE = 3,
  PREMIUM_RATE = 4,
  SHARED_COST = 5,
  VOIP = 6,
  PERSONAL_NUMBER = 7,
  PAGER = 8,
  UAN = 9,
  VOICEMAIL = 10,
  UNKNOWN = -1,
}

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
}

export enum MatchType {
  EXACT_MATCH,
  NO_MATCH,
  NOT_A_NUMBER,
  NSN_MATCH,
  SHORT_NSN_MATCH,
}
