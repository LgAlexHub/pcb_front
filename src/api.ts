// prod url = https://slow-tuna-53.deno.dev
export const API_BASE_URL = new URL('http://localhost:8082');

export function endpoint(endpoint : string, paramaters : { key : string, value : string}[] | undefined |null, protocol = 'http') : URL {
    const endPointUrl = new URL(API_BASE_URL.toString() + endpoint);
    if (paramaters){
        for (const parameter of paramaters){
            endPointUrl.searchParams.set(
                encodeURI(parameter.key),
                encodeURI(parameter.value)
            );
        }
    }
    endPointUrl.protocol = protocol;
    return endPointUrl; 
}

