import { Inject, Injectable } from '@nestjs/common';
import { GridFSBucket } from 'mongodb';
import { throwError } from 'rxjs';
import { Readable } from 'stream';
import { FileInterface } from './interfaces/file.interface';
import streamToPromise = require('stream-to-promise');

@Injectable()
export class FileUploadService {
  constructor(
    @Inject('RECORDINGS_BUCKET')
    private readonly bucket: GridFSBucket,
  ) { }

  public async upload(file: FileInterface, filename: string): Promise<string> {
    if (!file || !filename) {
      throwError('Unable to upload, empty arguments');
      return;
    }

    // Covert buffer to Readable Stream
    const recordingFileStream = new Readable();
    recordingFileStream.push(file.buffer);
    recordingFileStream.push(null);

    // Open bucket and stream
    const uploadStream = this.bucket.openUploadStream(filename);
    const id = uploadStream.id.toString();
    recordingFileStream.pipe(uploadStream);

    // Wait for completion
    return streamToPromise(uploadStream).then(() => {
      return Promise.resolve(id);
    });
  }

}
