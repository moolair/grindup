/**
 * ID 토큰에서 uid 를 꺼냅니다.
 *
 * 주의: 여기서는 서명을 검증하지 않습니다. 의도된 설계입니다 —
 * 이 uid 는 Firestore 문서 경로를 만드는 데만 쓰이고, 실제 접근 허용 여부는
 * Firestore 가 같은 토큰을 검증한 뒤 보안 규칙으로 판단합니다.
 * 따라서 uid 를 위조해도 Firestore 단계에서 거부됩니다.
 * (게이트웨이가 자체 권한으로 뭔가 판단하게 되는 순간, 여기서 firebase-admin
 *  으로 verifyIdToken 을 해야 합니다.)
 */

interface IdTokenPayload {
    sub?: string;
    user_id?: string;
}

export const decodeUid = (idToken: string): string | null => {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
        return null;
    }

    const payloadSegment = parts[1];
    if (!payloadSegment) {
        return null;
    }

    try {
        const json = Buffer.from(payloadSegment, 'base64url').toString('utf8');
        const payload = JSON.parse(json) as IdTokenPayload;
        return payload.user_id ?? payload.sub ?? null;
    } catch {
        return null;
    }
};

/** Authorization 헤더에서 Bearer 토큰 추출 */
export const bearerToken = (authorizationHeader: string | undefined): string | null => {
    if (!authorizationHeader) {
        return null;
    }
    const match = /^Bearer\s+(.+)$/i.exec(authorizationHeader.trim());
    return match?.[1] ?? null;
};
