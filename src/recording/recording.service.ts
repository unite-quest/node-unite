import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { extname } from 'path';
import { Observable } from 'rxjs';
import AuthUserModel from '../auth/auth-user.model';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import { SkipRecordingDto } from './dto/skip-recording.dto';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import RecordingTheme from './interfaces/recording-theme.interface';
import { Recording } from './interfaces/recording.interface';
import { UserRecording } from './interfaces/user-recording.interface';

@Injectable()
export class RecordingService {
  constructor(
    @Inject('USER_RECORDING_MODEL')
    private userRecordingModel: Model<UserRecording>,
    private fileUploadService: FileUploadService,
  ) { }

  // this shouldnt be here, but where?
  public async createEmptyUserIfNonExistent(user: AuthUserModel): Promise<UserRecording> {
    const dbUser = await this.userRecordingModel.findOne({ 'user.firebaseId': user.uid }).exec();
    if (dbUser) {
      return dbUser;
    }

    return this.userRecordingModel.create({
      user: {
        firebaseId: user.uid,
      },
      themes: [],
    });
  }

  /**
   * Appends recording to user.
   * [PREREQUISITES] user should be created before
   *
   * @param {AppendUserRecordingDto} recordingDto
   * @param {FileInterface} file
   * @param {AuthUserModel} user
   * @returns {Observable<any>}
   * @memberof RecordingService
   */
  public async append(recordingDto: AppendUserRecordingDto, themeName: string, file: FileInterface, user: AuthUserModel):
    Promise<RecordingTheme | BadRequestException> {
    // find user
    const query = { 'user.firebaseId': user.uid };
    const dbUser = await this.userRecordingModel.findOne(query).exec();
    if (!dbUser) {
      return new BadRequestException('User not found.');
    }

    // upload recording
    const filename = this._getFilename(recordingDto, file);
    const format = this._getFileExtension(file).indexOf('wav') >= 0 ? 'wav' : 'webm';
    const recordingPath = await this.fileUploadService.upload(file, filename).toPromise();
    const recording: Recording = {
      ...recordingDto,
      format,
      recordingPath,
      skipped: false,
    };

    // try to find theme
    let recordingTheme: RecordingTheme = dbUser.themes.find((each) => each.title === themeName);
    if (recordingTheme) { // push if found
      recordingTheme.recordings.push(recording);
    } else { // create theme if not found
      recordingTheme = {
        title: themeName,
        recordings: [recording],
      };
      dbUser.themes.push(recordingTheme);
    }
    await dbUser.save();
    return recordingTheme;
  }

  public skip(recordingDto: SkipRecordingDto, user: AuthUserModel): any {
    // this.recordingModel.findBy()
  }

  private _getFilename(recording: AppendUserRecordingDto, file: FileInterface): string {
    return `${new Date().toISOString()}${this._getFileExtension(file)}`;
  }

  private _getFileExtension(file: FileInterface): string {
    return extname(file.originalname);
  }
}
