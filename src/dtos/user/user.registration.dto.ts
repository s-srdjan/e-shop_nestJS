import * as Validator from 'class-validator';

export class UserRegistrationDto {

    @Validator.IsNotEmpty()
    @Validator.IsEmail({
      allow_ip_domain: false,
      alow_utf8_local_part: true,
      require_tld: true
    })
    email: string;

    @Validator.IsNotEmpty() 
    @Validator.IsString()
    @Validator.Length(6,128)
    // @Validator.Matches(/^.{6,128}$/, {
    //     message: 'Lozinka mora da sadrzi minimalno 6 karaktera.'
    // })
    password: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    forename: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    surname: string;

    @Validator.IsNotEmpty()
    @Validator.IsPhoneNumber(null)
    phoneNumber: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(10, 512)
    postalAddress: string;
}