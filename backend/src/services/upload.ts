import { createReadStream, createWriteStream, unlinkSync } from 'fs';
import { resolve } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { UploadType, UserUpload } from '../schemas';
import { AbstractService } from './abstract';

const basePathByUploadType: Record<UploadType, string> = {
  [UploadType.PROFILE_IMAGE]: './www/user-uploads/user-media/profile-images/',
};

const pump = promisify(pipeline);

export class UploadService extends AbstractService {
  async upload(file: File, { userId, uploadType }: Pick<UserUpload, 'userId' | 'uploadType'>) {
    const fileName = [userId, Date.now(), file.filename].join('-');
    const filePath = resolve(basePathByUploadType[uploadType], fileName);

    try {
      await pump(file.file, createWriteStream(filePath));
    } catch (error) {
      this.log.info(error, 'failed to write file to disk');
      unlinkSync(filePath);
      throw this.errors.badRequest();
    }

    return this.repositories.userUpload.create({
      userId,
      uploadType,
      fileName,
      filePath,
      fileType: file.mimetype,
      fileEncoding: file.encoding,
      originalFileName: file.filename,
    });
  }

  download = (id: UserUpload['id'], stream: NodeJS.WritableStream) =>
    this.repositories.userUpload.findOne({ id }).then(({ filePath }) =>
      pump(createReadStream(filePath), stream).catch(error => {
        this.log.error(error, 'failed to send file to client');
        throw this.errors.badRequest();
      }),
    );

  async delete(id: UserUpload['id']) {
    const connection = await this.database.connection();
    try {
      const upload = await this.repositories.userUpload.findOne({ id }, connection.query);
      unlinkSync(upload.filePath);
      await this.repositories.userUpload.delete({ id }, connection.query);
    } catch (error) {
      throw this.errors.badRequest(error.message);
    } finally {
      connection.close();
    }
  }
}

interface File {
  file: NodeJS.ReadableStream;
  encoding: string;
  filename: string;
  mimetype: string;
}
