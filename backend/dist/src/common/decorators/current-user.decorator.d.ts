export type RequestUser = {
    sub: string;
    email: string;
    roles: string[];
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
