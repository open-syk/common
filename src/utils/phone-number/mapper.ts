import { ValidationResult } from './entities';

export const mapGoogleReason: Record<number, ValidationResult> = {
  0: ValidationResult.IS_POSSIBLE,
  1: ValidationResult.INVALID_COUNTRY_CODE,
  2: ValidationResult.TOO_SHORT,
  3: ValidationResult.TOO_LONG,
  4: ValidationResult.IS_POSSIBLE_LOCAL_ONLY,
  5: ValidationResult.INVALID_LENGTH,
};
