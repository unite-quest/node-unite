import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class FileUploadService {
  constructor(
    private httpService: HttpService,
  ) { }

  upload(file: any): Observable<string> {
    return this.httpService.post('https://content.dropboxapi.com/2/files/upload', file, {
      headers: {
        'Authorization': `Bearer ${process.env.DROPBOX_APP_TOKEN}`,
        'Dropbox-API-Arg': '{"path": "/voices/test.wav","mode": "add","autorename": true,"mute": false,"strict_conflict": false}',
        'Content-Type': 'application/octet-stream',
      }
    }).pipe(map((response) => {
      console.log(response.data);
      return '';
    }));
  }
}
