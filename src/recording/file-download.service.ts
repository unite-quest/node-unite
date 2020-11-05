import { Inject, Injectable } from '@nestjs/common';
import { GridFSBucket, GridFSBucketReadStream, ObjectId } from 'mongodb';
import streamToPromise = require('stream-to-promise');

@Injectable()
export class FileDownloadService {
  constructor(
    @Inject('RECORDINGS_BUCKET')
    private readonly bucket: GridFSBucket,
  ) { }

  public donwload(id: string): GridFSBucketReadStream {
    if (!id) {
      Promise.reject('Unable to download, empty arguments');
    }

    // Open bucket and stream
    return this.bucket.openDownloadStream(new ObjectId(id));
  }
}
