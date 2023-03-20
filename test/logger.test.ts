import VError from 'verror';
import { debug, error, info } from 'winston';

import Logger from '../src/logger';

jest.mock('winston', () => {
  const mFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    label: jest.fn(),
    colorize: jest.fn(),
    json: jest.fn(),
  };
  const mTransports = {
    Console: jest.fn(),
    File: jest.fn(),
  };

  const mInfo = jest.fn();
  const mDebug = jest.fn();
  const mError = jest.fn();

  const mLogger = {
    info: mInfo,
    error: mError,
    debug: mDebug,
  };

  return {
    format: mFormat,
    transports: mTransports,
    createLogger: jest.fn(() => mLogger),
    info: mInfo,
    debug: mDebug,
    error: mError,
  };
});

describe('Logger', () => {
  const logger = Logger('test');
  const data = {
    name: 'ditto',
    order: 214,
    species: {
      name: 'ditto',
      url: 'https://pokeapi.co/api/v2/pokemon-species/132/',
    },
    sprites: {
      dream_world: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/132.svg',
      },
      other: {
        home: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/132.png',
        },
      },
    },
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should mask the info data with depth 0', () => {
    const maskedFields = ['name'];
    const expectedData = Object.assign({}, data);
    expectedData.name = '*'.repeat(data.name.length);
    logger.info('INFO', data, maskedFields);
    expect(info).toHaveBeenCalled();
    expect(info).toHaveBeenCalledWith('INFO', { data: expectedData });
  });

  it('should mask the info data with depth 1', () => {
    const maskedFields = ['species.name'];
    const expectedData = Object.assign({}, data);
    expectedData.species.name = '*'.repeat(data.species.name.length);
    logger.info('INFO', data, maskedFields);
    expect(info).toHaveBeenCalled();
    expect(info).toHaveBeenCalledWith('INFO', { data: expectedData });
  });

  it('should mask the info data with depth 2', () => {
    const maskedFields = ['sprites.dream_world.front_default'];
    const expectedData = Object.assign({}, data);
    logger.info('INFO', data, maskedFields);
    expectedData.sprites.dream_world.front_default = '*'.repeat(
      data.sprites.dream_world.front_default.length,
    );
    expect(info).toHaveBeenCalled();
    expect(info).toHaveBeenCalledWith('INFO', { data: expectedData });
  });

  it('should mask the info data with depth 3', () => {
    const maskedFields = ['sprites.other.home.front_default'];
    const expectedData = Object.assign({}, data);
    expectedData.sprites.other.home.front_default = '*'.repeat(
      data.sprites.other.home.front_default.length,
    );
    logger.info('INFO', data, maskedFields);
    expect(info).toHaveBeenCalled();
    expect(info).toHaveBeenCalledWith('INFO', { data: expectedData });
  });

  it('should mask the data in the error logger', () => {
    const maskedFields = ['name'];
    const expectedData = Object.assign({}, data);
    const err = new Error('ERROR');
    const stacktrace = VError.fullStack(err);
    expectedData.name = '*'.repeat(data.name.length);
    logger.error('ERROR', data, err, maskedFields);
    expect(error).toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith('ERROR', {
      data: expectedData,
      stacktrace,
    });
  });

  it('should mask the data in the debug logger', () => {
    const maskedFields = ['name'];
    const expectedData = Object.assign({}, data);
    expectedData.name = '*'.repeat(data.name.length);
    logger.debug('INFO', data, maskedFields);
    expect(debug).toHaveBeenCalled();
    expect(debug).toHaveBeenCalledWith('INFO', { data: expectedData });
  });
});
