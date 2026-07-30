/**
 * Firestore REST v1 얇은 클라이언트.
 *
 * 설계 의도: 이 게이트웨이는 서비스 어카운트 키를 갖지 않습니다.
 * 앱이 보낸 Firebase ID 토큰을 그대로 Firestore 에 물려주므로
 *   - 새 크레덴셜을 레포에 추가할 필요가 없고
 *   - Firestore 보안 규칙이 "실제 그 사용자" 권한으로 그대로 적용됩니다.
 * 즉 게이트웨이는 권한을 승격시키지 않는 순수 패스스루입니다.
 */

import { config } from './config.js';

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';

/** Firestore REST 가 돌려주는 타입 태그드 값 */
export interface FirestoreValue {
    stringValue?: string;
    integerValue?: string;
    doubleValue?: number;
    booleanValue?: boolean;
    timestampValue?: string;
    nullValue?: null;
}

export interface FirestoreDocument {
    /** 전체 리소스 경로. 예: projects/p/databases/(default)/documents/habits/uid/items/routine-1 */
    name: string;
    fields?: Record<string, FirestoreValue>;
    createTime?: string;
    updateTime?: string;
}

interface ListDocumentsResponse {
    documents?: FirestoreDocument[];
    nextPageToken?: string;
}

/** 문서 리소스 경로에서 마지막 세그먼트(문서 ID)만 뽑음 */
export const documentId = (resourceName: string): string =>
    resourceName.slice(resourceName.lastIndexOf('/') + 1);

export const readString = (value: FirestoreValue | undefined): string | null =>
    typeof value?.stringValue === 'string' ? value.stringValue : null;

export const readInt = (value: FirestoreValue | undefined): number | null => {
    if (value?.integerValue !== undefined) {
        const parsed = Number(value.integerValue);
        return Number.isFinite(parsed) ? parsed : null;
    }
    if (typeof value?.doubleValue === 'number') {
        return Math.trunc(value.doubleValue);
    }
    return null;
};

const documentsUrl = (path: string): string =>
    `${FIRESTORE_BASE}/projects/${config.projectId}/databases/(default)/documents/${path}`;

/** Firestore 호출 실패를 GraphQL 로 올릴 때 쓰는 에러 */
export class FirestoreError extends Error {
    constructor(readonly status: number, message: string) {
        super(message);
        this.name = 'FirestoreError';
    }
}

const request = async (url: string, idToken: string): Promise<unknown> => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${idToken}`,
            Accept: 'application/json',
        },
    });

    if (response.status === 404) {
        // 문서/컬렉션이 아직 없는 정상 케이스
        return null;
    }

    if (!response.ok) {
        const body = await response.text();
        throw new FirestoreError(
            response.status,
            `Firestore 요청 실패 (${response.status}): ${body.slice(0, 500)}`
        );
    }

    return response.json();
};

/**
 * 단일 문서 조회. 없으면 null.
 */
export const getDocument = async (
    path: string,
    idToken: string
): Promise<FirestoreDocument | null> => {
    const json = await request(documentsUrl(path), idToken);
    return (json as FirestoreDocument | null) ?? null;
};

/**
 * 컬렉션 문서 목록 조회. 페이지네이션을 끝까지 따라갑니다.
 */
export const listDocuments = async (
    path: string,
    idToken: string
): Promise<FirestoreDocument[]> => {
    const documents: FirestoreDocument[] = [];
    let pageToken: string | undefined;

    do {
        const url = new URL(documentsUrl(path));
        url.searchParams.set('pageSize', '300');
        if (pageToken) {
            url.searchParams.set('pageToken', pageToken);
        }

        const json = (await request(url.toString(), idToken)) as ListDocumentsResponse | null;
        if (!json) {
            break;
        }

        documents.push(...(json.documents ?? []));
        pageToken = json.nextPageToken;
    } while (pageToken);

    return documents;
};
