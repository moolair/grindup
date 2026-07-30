import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';

/**
 * 로컬 GraphQL 게이트웨이(server/) 주소.
 * iOS 시뮬레이터는 호스트의 localhost 를 그대로 쓸 수 있지만,
 * Android 에뮬레이터는 10.0.2.2 로 호스트를 가리켜야 합니다.
 * 실기기에서 테스트할 때는 GRAPHQL_HOST 를 맥의 LAN IP 로 바꾸세요.
 */
const GRAPHQL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const GRAPHQL_PORT = 4000;

export const GRAPHQL_ENDPOINT = `http://${GRAPHQL_HOST}:${GRAPHQL_PORT}/`;

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

/**
 * 매 요청마다 Firebase ID 토큰을 Authorization 헤더에 붙입니다.
 * 게이트웨이는 이 토큰을 그대로 Firestore 에 넘기므로, 로그인한 사용자
 * 본인의 데이터만 조회됩니다. getIdToken() 은 만료 시 자동 갱신합니다.
 */
const authLink = setContext(async (_operation, { headers }) => {
    const user = auth().currentUser;
    if (!user) {
        console.log('[GraphQL] 로그인된 사용자가 없어 토큰 없이 요청합니다.');
        return { headers };
    }

    try {
        const idToken = await user.getIdToken();
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${idToken}`,
            },
        };
    } catch (error) {
        console.error('[GraphQL] ID 토큰 획득 실패:', error);
        return { headers };
    }
});

export const apolloClient = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export default apolloClient;
