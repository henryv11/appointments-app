import { createReadStream, createWriteStream, unlinkSync } from 'fs';
import { resolve } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { UploadType, UserUpload } from '../schemas';
import { AbstractService } from './abstract';

//#region [Constants]

const basePathByUploadType: Record<UploadType, string> = {
  [UploadType.PROFILE_IMAGE]: './www/user-uploads/user-media/profile-images/',
};

//#endregion

//#region [Utils]

const pump = promisify(pipeline);

//#endregion

export class UploadService extends AbstractService {
  //#region [Public]

  upload(file: File, { userId, uploadType }: Pick<UserUpload, 'userId' | 'uploadType'>) {
    const fileName = [userId, Date.now(), file.filename].join('-');
    const filePath = resolve(basePathByUploadType[uploadType], fileName);

    return pump(file.file, createWriteStream(filePath))
      .then(() =>
        this.repositories.userUpload.create({
          userId,
          uploadType,
          fileName,
          filePath,
          fileType: file.mimetype,
          fileEncoding: file.encoding,
        }),
      )
      .catch(error => {
        this.log.info(error, 'failed to write file to disk');
        unlinkSync(filePath);
        throw this.errors.badRequest();
      });
  }

  download = (id: UserUpload['id'], stream: NodeJS.WritableStream) =>
    this.repositories.userUpload.findOne({ id }).then(({ filePath }) =>
      pump(createReadStream(filePath), stream).catch(error => {
        this.log.error(error, 'failed to send file to client');
        throw this.errors.badRequest();
      }),
    );

  //#endregion
}

//#region [Types]

interface File {
  file: NodeJS.ReadableStream;
  encoding: string;
  filename: string;
  mimetype: string;
}

//#endregion
