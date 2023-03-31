# `@open-syk/common`

The `@open-syk/common` library is a collection of packages that provide common functionalities that can be used across projects. The packages currently available are:

## Packages

### @open-syk/common/config

The `@open-syk/common/config` package provides a configuration singleton that can be used to load environment variables and configuration files. It exposes a SykConfigSingleton class that can be instantiated to load the configuration files. The package also provides a run method to initiate the loading of configuration files.

Example usage:

```typescript
import { SykConfigSingleton } from '@open-syk/common/config';
import * as path from 'path';

SykConfigSingleton
  .getInstance()
  .run(path.join(__dirname, 'lib/config/envs'));
```

### @open-syk/common/logger

The `@open-syk/common/logger` package provides a logging functionality that can be used to log messages to the console or a file. It exposes a `Logger` class that can be instantiated to create a logger. The logger can log messages at different levels such as `info`, `debug`, `error`, etc. The package also provides a way to mask sensitive data fields in the logged messages.

Example usage:

```typescript
import Logger from '@open-syk/common/logger';
const logger = Logger("test");

const maskedFields = ['...']
const data = {...}
logger.info('message', data, maskedFields)
```

### @open-syk/common/db/typeorm

The `@open-syk/common/db/typeorm` package provides a way to perform database operations using TypeORM. It exposes two methods, `onSession` and `onTransaction`, that can be used to perform read and write operations, respectively.

Example usage:

```typescript
import { onSession, onTransaction } from '@open-syk/common/db/typeorm';

// to get records
const user = await onSession(dataSource, async (manager) => {
  return this.userService.findOne(manager, email);
});

// to create, update and delete records
const userCreated = await onTransaction(dataSource, async (manager) => {
  return this.userService.create(manager, {
    email,
    name
  });
});
```

### @open-syk/common/errors

The `@open-syk/common/errors` package provides a decorator `orThrowError` that can be used to throw an error when a condition is not met. The decorator takes an error class that will be used to throw the error.

```typescript
import { orThrowError } from '@open-syk/common/errors';

export class ErrorValidator {
  @orThrowError(BadRequestException)
  static orThrowBadRequestError(response: any, messageError: string) {}
}
```
