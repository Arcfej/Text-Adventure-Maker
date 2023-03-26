export const corsHeaders = {
		'Access-Control-Allow-Headers': '*',
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Origin': '*',
};

export function toJSON(data: unknown, status = 200): Response {
    let body = JSON.stringify(data, null, 2);
    let headers = {'content-type': 'application/json', ...corsHeaders};
    return new Response(body, {headers, status});
}

export function toError(error: string | unknown, status = 400): Response {
    return toJSON({error}, status);
}

export function reply(output: any): Response {
    if (output != null) return toJSON(output, 200);
    return toError('Error with query', 500);
}
