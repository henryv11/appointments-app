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
        description: 'Upload a file',
        tags,
        querystring: postUploadQuery,
      },
    },
    async (req, res) => {
      try {
        if (!req.isMultipart()) throw app.errors.badRequest('body has to be multipart form data');
        for await (const data of await req.files()) {
          if (!data.file) {
            continue;
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await app.services.upload.upload(data, { userId: req.user!.userId, uploadType: req.query.uploadType });
        }
        res.status(201);
        return 'file uploaded';
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  );

  app.get<{ Params: { uploadId: UserUpload['id'] } }>(
    '/upload/:uploadId',
    { authorize: true, schema: { description: 'Download an uploaded file', tags } },
    async (req, res) => {
      const file = await app.services.upload.download(req.params.uploadId);
      await pump(file.stream, res.raw);
    },
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
