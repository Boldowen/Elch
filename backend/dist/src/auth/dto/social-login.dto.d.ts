export declare enum SocialProvider {
    GOOGLE = "GOOGLE",
    APPLE = "APPLE"
}
export declare class SocialLoginDto {
    provider: SocialProvider;
    identityToken: string;
    name?: string;
}
