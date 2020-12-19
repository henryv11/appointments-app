import { FastifyPluginCallback } from 'fastify';
import {
  deleteUploadParameters,
  DeleteUploadParameters,
  getUploadParameters,
  GetUploadParameters,
  listUserUpload,
  ListUserUpload,
  postUploadQuery,
  PostUploadQuery,
} from '../schemas';

const tags = ['upload'];
const path = '/upload';

export const uploadControllers: FastifyPluginCallback = function (app, _, done) {
  app.post<{ Querystring: PostUploadQuery }>(
    path,
    {
      authorize: true,
      schema: {
        description: 'Upload file(s)',
        tags,
        querystring: postUploadQuery,
      },
    },
    async (req, res) => {
      if (!req.isMultipart() || !req.user) throw app.errors.badRequest();
      res.status(201);
      const uploads = [];
      for await (const file of await req.parts()) {
        if (file.file)
          uploads.push(
            await app.services.upload.upload(file, {
              userId: req.user.userId,
              uploadType: req.query.uploadType,
            }),
          );
        else return uploads; // returning here is a fix for https://github.com/fastify/fastify-multipart/issues/185
      }
    },
  );

  app.get<{ Params: GetUploadParameters }>(
    `${path}/:uploadId`,
    {
      authorize: true,
      schema: {
        description: 'Download an uploaded file',
        tags,
        params: getUploadParameters,
      },
    },
    (req, res) => app.services.upload.download(req.params.uploadId, res.raw),
  );

  app.delete<{ Params: DeleteUploadParameters }>(
    `${path}/:uploadId`,
    {
      authorize: true,
      schema: {
        description: 'Delete an upload file',
        tags,
        params: deleteUploadParameters,
      },
    },
    req => app.services.upload.delete(req.params.uploadId).then(() => 'upload deleted'),
  );

  app.get<{ Querystring: ListUserUpload }>(
    path,
    {
      authorize: true,
      schema: {
        description: 'List uploads',
        tags,
        querystring: listUserUpload,
      },
    },
    req => app.repositories.userUpload.list(req.query),
  );

  done();
};
