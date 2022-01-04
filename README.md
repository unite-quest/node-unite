# Fala Alguma Coisa

The "Fala Alguma Coisa" ecosystem consists of three applications (app, backend and recognition). It stores anonymous data and voice recordings (Portuguese Brazil) to a database. This data is later used to train a speech recognition system.

## Ecosystem

- App: Basic anonymous data is collected, also the voice is recorded here. (https://github.com/gabrieltnishimura/react-falaalgumacoisa)
- Backend: Anonymous data and recordings are stored to a database. It also manages word suggestion to the app recordings. (this repo)
- Speech Recognition: Using Tensorflow APIs (>2.0.0), speech data is converted to MFCC to train a neural network using [Graves's CTC](https://www.cs.toronto.edu/~graves/icml_2006.pdf). (https://github.com/gabrieltnishimura/tf2-ctc-speech-recognition)

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Example payload

To insert a recording, use `/recording` endpoint. Example below:

```sh
curl --location --request POST 'localhost/recording' \
--header 'Content-Type: application/json' \
--data-raw '{
  "mediaPath": "dropbox.com",
  "sampleRate": 16000,
  "phoneMetadata": "ASD",
  "length": "",
  "speaker": {
  "age": "28",
  "sex": "M",
  "origin": "SP",
  "motherLanguage": "PT_BR"
  }
}'
```
