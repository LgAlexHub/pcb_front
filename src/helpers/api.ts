import { ENV } from "./environment.ts";

const api_prod_url = 'https://slow-tuna-53.deno.dev';
const api_dev_url = 'http://localhost:8082';
export const API_BASE_URL = new URL(ENV.mode === 'production' ? api_prod_url : api_dev_url);

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

