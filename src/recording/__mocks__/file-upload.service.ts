import { Observable, of } from 'rxjs';

export class FileUploadService {
  upload(file: any): Observable<string> {
    return of('path-to-wav.wav');
  }
}
