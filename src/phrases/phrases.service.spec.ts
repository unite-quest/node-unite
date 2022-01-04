const mockingoose = require('mockingoose');
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Model, model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import { UserRecordingService } from '../recording/__mocks__/user-recording.service';
import { ScoringTypes } from '../scoring/interfaces/scoring-types';
import { ScoringService } from '../scoring/scoring.service';
import PhrasesInterface from './interfaces/phrases.interface';
import { PhrasesService } from './phrases.service';
import { PhrasesSchema } from './schemas/phrases.schema';

jest.mock('../scoring/scoring.service');

describe('PhrasesService', () => {
  let phrasesService: PhrasesService;
  let phrasesModel: Model<PhrasesInterface>;
  let mockUserRecordingService: UserRecordingService;
  let mockScoringService: ScoringService;

  const phrasesDb = {
    title: 'ciencia',
    cover: 'test.png',
    phrases: [
      {
        _id: 'id_0',
        text: 'phrase 1',
      },
      {
        _id: 'id_1',
        text: 'phrase 2',
      },
      {
        _id: 'id_2',
        text: 'phrase 3',
      },
      {
        _id: 'id_3',
        text: 'phrase 4',
      },
      {
        _id: 'id_4',
        text: 'phrase 5',
      },
    ],
  };
  const user = new AuthUserModel({
    user_id: 'this dude',
    name: 'has name',
    email: 'also has email',
  });

  beforeEach(async () => {
    phrasesModel = model<PhrasesInterface>('Phrases', PhrasesSchema);
    PhrasesSchema.path('phrases', Object);
    mockUserRecordingService = new UserRecordingService();
    mockScoringService = new ScoringService(null);

    const moduleRef = await Test.createTestingModule({
      providers: [
        PhrasesService,
        {
          provide: UserRecordingService,
          useValue: mockUserRecordingService,
        },
        {
          provide: 'PHRASES_MODEL',
          useValue: phrasesModel,
        },
        {
          provide: ScoringService,
          useValue: mockScoringService,
        },
      ],
    }).compile();

    phrasesService = moduleRef.get<PhrasesService>(PhrasesService);
  });

  describe('phrases service', () => {
    it('should resolve deps', () => {
      expect(phrasesService).not.toBeUndefined();
    });
  });

  describe('themes', () => {
    it('should get themes', async () => {
      mockingoose(phrasesModel).toReturn(phrasesDb, 'findOne');

      const theme = await phrasesService.getTheme('theme', user);

      expect(theme.cover).toBe('test.png');
      expect(theme.title).toBe('ciencia');
      expect(theme.total).toBe(5);
      expect(theme.stepsCap).toBe(1);
      expect(theme.modalEvents.length).toBe(2);
      expect(theme.modalEvents[0].eventIndex).toBe(1);
      expect(theme.modalEvents[0].score).toBe(100);
      expect(theme.modalEvents[0].type).toBe('FIRST_RECORDING');
      expect(theme.phrases.length).toBe(5);
      expect(theme.phrases[0].id).toBe('id_0');
      expect(theme.phrases[0].text).toBe('phrase 1');
      expect(theme.phrases[0].spoken).toBe(false);
      expect(theme.phrases[0].skipped).toBe(false);
    });

    it('should not get themes when finished is true', async () => {
      mockingoose(phrasesModel).toReturn(phrasesDb, 'findOne');
      mockUserRecordingService.getUserRecordingTheme = jest
        .fn()
        .mockReturnValue({
          finished: true,
        });

      expect.assertions(1);
      try {
        await await phrasesService.getTheme('theme', user);
      } catch (e) {
        expect(e).toStrictEqual(
          new BadRequestException('Already finished recording'),
        );
      }
    });

    it('should fail to get themes when non existent', async () => {
      mockingoose(phrasesModel).toReturn(undefined, 'findOne');
      expect.assertions(1);
      try {
        await await phrasesService.getTheme('theme', user);
      } catch (e) {
        expect(e).toStrictEqual(
          new BadRequestException('Theme does not exist'),
        );
      }
    });

    it('should return less modal events if user already scored', async () => {
      mockingoose(phrasesModel).toReturn(phrasesDb, 'findOne');
      mockUserRecordingService.getUser = jest.fn().mockReturnValue({
        user: {
          firebaseId: 'firebaseId',
        },
        themes: [],
      });
      mockScoringService.getOrCreateUserScoring = jest.fn().mockReturnValue({
        firebaseId: user.uid,
        nickname: '',
        total: 0,
        entries: [
          {
            score: 100,
            reason: ScoringTypes.FIRST_RECORDING,
          },
        ],
        friends: [],
      });

      const theme = await phrasesService.getTheme('theme', user);

      expect(theme.modalEvents.length).toBe(1);
    });
  });
});
