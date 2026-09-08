import { API_URL } from './const';

export function getData<T>(url: string): Promise<{ data: T }> {
  return fetch(`${API_URL}${url}`).then(checkResult<T>);
}

export function checkResult<T>(res: Response): Promise<{ data: T }> {
  if (!res.ok) throw new Error('Ошибка запроса на сервер');
  return res.json() as Promise<{ data: T }>;
}
