import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import AuthUserModel from '../auth/auth-user.model';
import AppendUserRecordingResponseDto from './dto/append-user-recording-response.dto';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import AssignNameDto from './dto/assign-name.dto';
import RegistrationDataDto from './dto/registration-data.dto';
import { SkipRecordingDto } from './dto/skip-recording.dto';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import { Recording } from './interfaces/recording.interface';
import UserRecordingTheme from './interfaces/user-recording-theme.interface';
import { ScoringService } from './scoring.service';
import { UserRecordingService } from './user-recording.service';

@Injectable()
export class RecordingService {
  constructor(
    private userRecordingService: UserRecordingService,
    private fileUploadService: FileUploadService,
    private scoringService: ScoringService,
  ) { }

  /**
   * Appends recording to user.
   * User is created if non existent
   *
   * @param {AppendUserRecordingDto} recordingDto
   * @param {FileInterface} file
   * @param {AuthUserModel} user
   * @returns {Observable<any>}
   * @memberof RecordingService
   */
  public async append(recordingDto: AppendUserRecordingDto, file: FileInterface, loggedUser: AuthUserModel):
    Promise<AppendUserRecordingResponseDto> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);

    // upload recording
    const filename = this._getFilename(recordingDto, file);
    const format = this._getFileExtension(file).indexOf('wav') >= 0 ? 'wav' : 'webm';
    const recordingPath = await this.fileUploadService.upload(file, filename).toPromise();
    const recording: Recording = {
      ...recordingDto,
      format,
      recordingPath,
    };

    // try to find theme
    let recordingTheme: UserRecordingTheme = user.themes.find((each) => each.title === recordingDto.themeId);
    if (recordingTheme) { // push if found
      recordingTheme.recordings.push(recording);
    } else { // create theme if not found
      recordingTheme = {
        title: recordingDto.themeId,
        finished: false,
        recordings: [recording],
      };
      user.themes.push(recordingTheme);
    }

    const validRecordings = recordingTheme.recordings.filter(recording => !recording?.skipped?.reason).length;
    recordingTheme.finished = validRecordings >= 6; // does this updates the array reference?
    const score = await this.scoringService.getNextScore(user, validRecordings);
    if (score) {
      user.scoring.push(score);
    }

    await user.save();
    return new AppendUserRecordingResponseDto(score, !recordingTheme.finished);
  }

  public async skip(recordingDto: SkipRecordingDto, loggedUser: AuthUserModel): Promise<UserRecordingTheme> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);

    let recordingTheme: UserRecordingTheme = user.themes.find((each) => each.title === recordingDto.themeId);
    const recording: Recording = {
      ...recordingDto,
      skipped: {
        reason: recordingDto.reason,
      },
    };

    if (recordingTheme) { // push if found
      recordingTheme.recordings.push(recording);
    } else { // create theme if not found
      recordingTheme = {
        title: recordingDto.themeId,
        finished: false,
        recordings: [recording],
      };
      user.themes.push(recordingTheme);
    }
    await user.save();
    return recordingTheme;
  }

  public async assignName(assignNameDto: AssignNameDto, loggedUser: AuthUserModel): Promise<void> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);
    user.user.nickname = assignNameDto.name;
    await user.save();
  }

  public async register(registrationDataDto: RegistrationDataDto, loggedUser: AuthUserModel): Promise<void> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);
    user.user.nickname = registrationDataDto.name;
    user.user.ageInterval = registrationDataDto.age;
    user.user.gender = registrationDataDto.gender;
    user.user.region = registrationDataDto.region;
    user.user.dialect = registrationDataDto.dialect;

    await user.save();
  }

  private _getFilename(recording: AppendUserRecordingDto, file: FileInterface): string {
    return `${new Date().toISOString()}${this._getFileExtension(file)}`;
  }

  private _getFileExtension(file: FileInterface): string {
    return extname(file.originalname);
  }
}
