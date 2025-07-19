export const fetchWithAuth = async (
  url: string,
  token: string,
  method: string = "GET",
  body: any = null
): Promise<Response> => {
  return await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });
};