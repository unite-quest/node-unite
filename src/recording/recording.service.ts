import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import AuthUserModel from '../auth/auth-user.model';
import { UserScoreEntry } from '../scoring/interfaces/user-score-entry.interface';
import { ScoringService } from '../scoring/scoring.service';
import AppendUserRecordingResponseDto from './dto/append-user-recording-response.dto';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import { SkipRecordingDto } from './dto/skip-recording.dto';
import { FileDownloadService } from './file-download.service';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import { Recording } from './interfaces/recording.interface';
import UserRecordingTheme from './interfaces/user-recording-theme.interface';
import { UserRecordingService } from './user-recording.service';

@Injectable()
export class RecordingService {
  public static readonly MINIMUM_RECORDING_COUNT = 6;

  constructor(
    private userRecordingService: UserRecordingService,
    private fileUploadService: FileUploadService,
    private fileDownloadService: FileDownloadService,
    private scoringService: ScoringService,
  ) {}

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
  public async append(
    recordingDto: AppendUserRecordingDto,
    file: FileInterface,
    loggedUser: AuthUserModel,
  ): Promise<AppendUserRecordingResponseDto> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);

    // upload recording
    const filename = this._getFilename(recordingDto, file);
    const format =
      this._getFileExtension(file).indexOf('wav') >= 0 ? 'wav' : 'webm';
    const recordingPath = await this.fileUploadService.upload(file, filename);

    const recording: Recording = {
      ...recordingDto,
      format,
      recordingPath,
    };

    // try to find theme
    let recordingTheme: UserRecordingTheme = user.themes.find(
      each => each.title === recordingDto.themeId,
    );
    if (recordingTheme) {
      // push if found
      recordingTheme.recordings.push(recording);
    } else {
      // create theme if not found
      recordingTheme = {
        title: recordingDto.themeId,
        finished: false,
        recordings: [recording],
      };
      user.themes.push(recordingTheme);
    }

    const validRecordings = recordingTheme.recordings.filter(
      recording => !recording?.skipped?.reason,
    ).length;
    recordingTheme.finished =
      validRecordings >= RecordingService.MINIMUM_RECORDING_COUNT; // does this updates the array reference?
    let score: UserScoreEntry = null;
    if (recordingTheme.finished) {
      score = await this.scoringService.scoreForRecordingTheme(loggedUser);
    } else {
      score = await this.scoringService.scoreForRecordingOnce(loggedUser);
    }

    await user.save();
    return new AppendUserRecordingResponseDto(score, !recordingTheme.finished);
  }

  public async skip(
    recordingDto: SkipRecordingDto,
    loggedUser: AuthUserModel,
  ): Promise<UserRecordingTheme> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);

    let recordingTheme: UserRecordingTheme = user.themes.find(
      each => each.title === recordingDto.themeId,
    );
    const recording: Recording = {
      ...recordingDto,
      skipped: {
        reason: recordingDto.reason,
      },
    };

    if (recordingTheme) {
      // push if found
      recordingTheme.recordings.push(recording);
    } else {
      // create theme if not found
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

  /**
   * For testing purposes.
   *
   * @param {AuthUserModel} loggedUser
   * @returns
   * @memberof RecordingService
   */
  public async download(loggedUser: AuthUserModel) {
    const user = await this.userRecordingService.getUser(loggedUser);
    return this.fileDownloadService.donwload('5fa40f710f721d414dd04113');
  }

  private _getFilename(
    recording: AppendUserRecordingDto,
    file: FileInterface,
  ): string {
    return `${new Date().toISOString()}${this._getFileExtension(file)}`;
  }

  private _getFileExtension(file: FileInterface): string {
    return extname(file.originalname);
  }
}
