import { FastifyPluginCallback } from 'fastify';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { listUploadQuery, ListUploadQuery, postUploadQuery, PostUploadQuery, UserUpload } from '../schemas';

const tags = ['upload'];

const pump = promisify(pipeline);

export const uploadControllers: FastifyPluginCallback = function (app, _, done) {
  app.post<{ Querystring: PostUploadQuery }>(
    '/upload',
    {
      authorize: true,
      schema: {
        description: 'Upload file(s)',
        tags,
        querystring: postUploadQuery,
      },
    },
    async (req, res) => {
      if (!req.isMultipart()) throw app.errors.badRequest('body has to be multipart form data');
      if (req.query.isMultiple) {
        for await (const file of await req.files()) {
          await app.services.upload.upload(file, {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            userId: req.user!.userId,
            uploadType: req.query.uploadType,
          });
        }
      } else {
        await app.services.upload.upload(await req.file(), {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userId: req.user!.userId,
          uploadType: req.query.uploadType,
        });
      }
      res.status(201);
      return 'file(s) uploaded';
    },
  );

  app.get<{ Params: { uploadId: UserUpload['id'] } }>(
    '/upload/:uploadId',
    { authorize: true, schema: { description: 'Download an uploaded file', tags } },
    (req, res) => app.services.upload.download(req.params.uploadId, res.raw),
  );

  app.get<{ Querystring: ListUploadQuery }>(
    '/upload',
    {
      authorize: true,
      schema: { description: 'List uploads', querystring: listUploadQuery },
    },
    req => app.repositories.userUpload.list(req.query),
  );

  done();
};
