import { PhoneNumberFormat as PNF, PhoneNumberUtil } from 'google-libphonenumber';
const phoneUtil = PhoneNumberUtil.getInstance();

console.log({ PNF, phoneUtil });
const main = () => {
  try {
    const number = phoneUtil.parse('+5731966375700000000', 'CO');

    const isPossibleReason = phoneUtil.isPossibleNumberWithReason(number);

    console.log('isPossibleReason: ', isPossibleReason);

    console.log(PhoneNumberUtil.ValidationResult.TOO_LONG);

    console.log('getCountryCode: ', number.getCountryCode());

    console.log('getNationalNumber: ', number.getNationalNumber());

    console.log('getExtension: ', number.getExtension());

    console.log('getCountryCodeSource: ', number.getCountryCodeSource());

    console.log('getItalianLeadingZero: ', number.getItalianLeadingZero());

    console.log('getRawInput: ', number.getRawInput());

    console.log('isPossibleNumber: ', phoneUtil.isPossibleNumber(number));

    console.log('isValidNumber: ', phoneUtil.isValidNumber(number));

    console.log('isValidNumberForRegion: ', phoneUtil.isValidNumberForRegion(number, 'US'));

    console.log('getRegionCodeForNumber: ', phoneUtil.getRegionCodeForNumber(number));

    console.log('getNumberType: ', phoneUtil.getNumberType(number));

    console.log('format: ', phoneUtil.format(number, PNF.E164));

    console.log('formatInOriginalFormat: ', phoneUtil.formatInOriginalFormat(number, 'US'));

    console.log('format: ', phoneUtil.format(number, PNF.NATIONAL));

    console.log('format: ', phoneUtil.format(number, PNF.INTERNATIONAL));

    console.log('formatOutOfCountryCallingNumber: US ', phoneUtil.formatOutOfCountryCallingNumber(number, 'US'));

    console.log('formatOutOfCountryCallingNumber: CH ', phoneUtil.formatOutOfCountryCallingNumber(number, 'CH'));

    console.log('formatOutOfCountryCallingNumber: CO ', phoneUtil.formatOutOfCountryCallingNumber(number, 'CO'));
  } catch (error) {
    console.log(error);
  }
};

main();
