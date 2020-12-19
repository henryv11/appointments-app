import { makeServiceFetch } from '@/lib/services';

const fetch = makeServiceFetch('upload');

export async function uploadFiles(token: string, uploadType: string, files: FileList) {
  const body = new FormData();
  for (const name in files) {
    body.append(name, files[name]);
  }
  const res = await fetch<UserUpload[]>({ query: { uploadType }, method: 'POST', body, token });
  if (res.status !== 201) throw new Error('failed to upload files');
  return res.json();
}

export async function listUploads(token: string, query: any) {
  const res = await fetch<UserUpload[]>({ method: 'GET', query, token });
  if (res.status !== 200) throw new Error('failed to list uploads');
  return res.json();
}

export async function deleteUpload(token: string, path: UserUpload['id']) {
  const res = await fetch({ method: 'DELETE', path, token });
  if (res.status !== 200) throw new Error('failed to delete upload');
}

export interface UserUpload {
  id: string;
  userId: string;
  uploadType: string;
  fileName: string;
  fileType: string;
  filePath: string;
  updatedAt: string;
  createdAt: string;
  fileEncoding: string;
  originalFileName: string;
  totalRows: string;
}
