# `@open-syk/common`

Syk Common Library

## Packages

### @open-syk/common/config

```typescript
import path from 'path';
import { SykConfigSingleton } from '@open-syk/common/config';

SykConfigSingleton
  .getInstance()
  .run(path.join(__dirname, 'lib/config/envs'));
```

### @open-syk/common/logger

```typescript
import Logger from '@open-syk/common/logger';
const logger = Logger("test");

const maskedFields = ['...']
const data = {...}
logger.info('message', data, maskedFields)
```

### @open-syk/common/db/typeorm

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

```typescript
import { orThrowError } from '@open-syk/common/errors';

export class ErrorValidator {
  @orThrowError(BadRequestException)
  static orThrowBadRequestError(response: any, messageError: string) {}
}
```