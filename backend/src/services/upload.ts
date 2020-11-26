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

function getFilePath(uploadType: UploadType, userId: UserUpload['userId'], fileName: string) {
  return resolve(basePathByUploadType[uploadType], [userId, Date.now(), fileName].join('-'));
}

const pump = promisify(pipeline);

//#endregion

export class UploadService extends AbstractService {
  //#region [Public]

  async upload(file: File, { userId, uploadType }: Pick<UserUpload, 'userId' | 'uploadType'>) {
    const filePath = getFilePath(uploadType, userId, file.filename);
    this.log.info({ uploadType, userId, filePath }, 'uploading file');

    try {
      await pump(file.file, createWriteStream(filePath));
    } catch (error) {
      this.log.info(error, 'failed to write file to disk');
      unlinkSync(filePath);
      throw this.errors.badRequest();
    }

    const upload = await this.repositories.userUpload.create({
      userId,
      uploadType,
      fileName: file.filename,
      fileType: file.mimetype,
      fileEncoding: file.encoding,
      filePath,
    });
    this.log.info(upload as any, 'file uploaded');
  }

  async download(id: UserUpload['id']) {
    const userUpload = await this.repositories.userUpload.findOne({ id });
    return { stream: createReadStream(userUpload.filePath), ...userUpload };
  }

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
