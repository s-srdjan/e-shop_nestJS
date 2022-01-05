import * as Validator from 'class-validator';

export class ArticleFeatureComponentDto {
    featureId: number;
    
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(1,255)
    value: string;
} 