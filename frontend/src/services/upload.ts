import { makeServiceFetch } from '@/lib/services';

const fetch = makeServiceFetch('upload');

export async function uploadFile(token: string, uploadType: string, files: FileList) {
  const body = new FormData();
  body.append('files', files[0]);
  await fetch({ query: { uploadType }, method: 'POST', body, token });
}

export async function listUploads(token: string, query: any) {
  const res = await fetch<any>({ method: 'GET', query, token });
  if (res.status !== 200) throw new Error('failed to list uploads');
  return res.json();
}
