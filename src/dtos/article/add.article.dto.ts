export class AddArticleDto {
    name: string;
    categoryId: number;
    excerpt: string;
    descritpion: string;
    price: number;
    features: {
        featureId: number;
        value: string;
    }[];
}