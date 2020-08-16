import { HttpService, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FileInterface } from './interfaces/file.interface';


@Injectable()
export class FileUploadService {
  constructor(
    private httpService: HttpService,
  ) { }

  public upload(file: FileInterface, filename: string): Observable<string> {
    if (!file || !filename) {
      throwError('Unable to upload, empty arguments');
      return;
    }

    return this.httpService.post('https://content.dropboxapi.com/2/files/upload', file, {
      headers: {
        'Dropbox-API-Arg': `{"path": "/voices/${filename}","mode": "add","autorename": true,"mute": false,"strict_conflict": false}`,
        'Authorization': `Bearer ${process.env.DROPBOX_APP_TOKEN}`,
        'Content-Type': 'application/octet-stream',
      }
    }).pipe(
      map((response) => {
        console.log('Saved', filename);
        return response.data.id;
      }),
      catchError((err: any) => {
        console.log(err);
        return throwError(err);
      }),
    );
  }
}
