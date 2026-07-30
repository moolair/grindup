import { bearerToken, decodeUid } from './auth.js';

export interface GatewayContext {
    idToken: string | null;
    uid: string | null;
}

export const buildContext = (authorizationHeader: string | undefined): GatewayContext => {
    const idToken = bearerToken(authorizationHeader);
    return {
        idToken,
        uid: idToken ? decodeUid(idToken) : null,
    };
};
