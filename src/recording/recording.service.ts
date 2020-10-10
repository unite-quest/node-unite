import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { extname } from 'path';
import AuthUserModel from '../auth/auth-user.model';
import AppendUserRecordingResponseDto from './dto/append-user-recording-response.dto';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import AssignNameDto from './dto/assign-name.dto';
import { SkipRecordingDto } from './dto/skip-recording.dto';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import RecordingTheme from './interfaces/recording-theme.interface';
import { Recording } from './interfaces/recording.interface';
import { UserRecording } from './interfaces/user-recording.interface';
import { ScoringService } from './scoring.service';

@Injectable()
export class RecordingService {
  constructor(
    @Inject('USER_RECORDING_MODEL')
    private userRecordingModel: Model<UserRecording>,
    private fileUploadService: FileUploadService,
    private scoringService: ScoringService,
  ) { }

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
  public async append(recordingDto: AppendUserRecordingDto, themeName: string, file: FileInterface, loggedUser: AuthUserModel):
    Promise<AppendUserRecordingResponseDto> {
    const user = await this.getUser(loggedUser);

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
    let recordingTheme: RecordingTheme = user.themes.find((each) => each.title === themeName);
    if (recordingTheme) { // push if found
      recordingTheme.recordings.push(recording);
    } else { // create theme if not found
      recordingTheme = {
        title: themeName,
        finished: false,
        recordings: [recording],
      };
      user.themes.push(recordingTheme);
    }

    const validRecordings = recordingTheme.recordings.filter(recording => !recording.skipped).length;
    recordingTheme.finished = validRecordings >= 6; // does this updates the array reference?
    const score = await this.scoringService.getNextScore(user, validRecordings);
    if (score) {
      user.scoring.push(score);
    }

    await user.save();
    return new AppendUserRecordingResponseDto(score, !recordingTheme.finished);
  }

  public async getUserRecordingsForTheme(themeName: string, loggedUser: AuthUserModel): Promise<RecordingTheme> {
    const user = await this.getUser(loggedUser);
    return user.themes.find((each) => each.title === themeName);
  }

  public async getUser(loggedUser: AuthUserModel): Promise<UserRecording> {
    const query = { 'user.firebaseId': loggedUser.uid };
    const user = await this.userRecordingModel.findOne(query).exec();
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    return user;
  }

  public async skip(recordingDto: SkipRecordingDto, themeName: string, loggedUser: AuthUserModel): Promise<RecordingTheme> {
    const user = await this.getUser(loggedUser);
    let recordingTheme: RecordingTheme = user.themes.find((each) => each.title === themeName);
    const recording: Recording = {
      ...recordingDto,
      skipped: true,
    };

    if (recordingTheme) { // push if found
      recordingTheme.recordings.push(recording);
    } else { // create theme if not found
      recordingTheme = {
        title: themeName,
        finished: false,
        recordings: [recording],
      };
      user.themes.push(recordingTheme);
    }
    await user.save();
    return recordingTheme;
  }

  public async assignName(assignNameDto: AssignNameDto, loggedUser: AuthUserModel): Promise<void> {
    const user = await this.getUser(loggedUser);
    user.user.nickname = assignNameDto.name;
    await user.save();
  }

  private _getFilename(recording: AppendUserRecordingDto, file: FileInterface): string {
    return `${new Date().toISOString()}${this._getFileExtension(file)}`;
  }

  private _getFileExtension(file: FileInterface): string {
    return extname(file.originalname);
  }
}
