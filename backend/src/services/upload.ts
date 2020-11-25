import { FastifyRequest } from 'fastify';
import { createReadStream, createWriteStream, unlinkSync } from 'fs';
import { resolve } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { UploadType, UserUpload } from '../schemas';
import { AbstractService } from './abstract';

//#region [Constants]

const basePathByUploadType: Record<UploadType, string> = {
  [UploadType.PROFILE_IMAGE]: 'uploads/user-media/profile-images',
};

//#endregion

//#region [Utils]

const pump = promisify(pipeline);

//#endregion

export class UploadService extends AbstractService {
  //#region [Public]

  async upload(file: File, { userId, uploadType }: Pick<UserUpload, 'userId' | 'uploadType'>) {
    const filePath = resolve(basePathByUploadType[uploadType], [userId, Date.now(), file.filename].join('-'));

    try {
      await pump(file.file, createWriteStream(filePath, { encoding: file.encoding as BufferEncoding }));
    } catch (error) {
      this.log.info(error, 'failed to write file to disk');
      unlinkSync(filePath);
      throw this.errors.badRequest();
    }

    return this.repositories.userUpload.create({
      userId,
      uploadType,
      fileName: file.filename,
      fileType: file.mimetype,
      filePath,
    });
  }

  async download(id: UserUpload['id']) {
    const userUpload = await this.repositories.userUpload.findOne({ id });
    return { stream: createReadStream(userUpload.filePath), ...userUpload };
  }

  //#endregion
}

//#region [Types]

type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;
type File = UnwrapPromise<ReturnType<FastifyRequest['file']>>;

//#endregion
