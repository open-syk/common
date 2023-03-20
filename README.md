# `@open-syk/common`

Syk Common Library

### Packages

* `@open-syk/common/config`

```typescript
import { SykConfigSingleton } from '@open-syk/common/config';

const config = SykConfigSingleton.getInstance();
config.run(path.join(__dirname, 'dist/config/envs'));
```

* `@open-syk/common/logger`



```typescript
import logger from '@open-syk/common/logger';

const maskedFields = ['...']
const data = {...}
logger.info('message', data, maskedFields)
```

* `@open-syk/common/db/typeorm`
* `@open-syk/common/errors`

```typescript
import { orThrowError } from '@open-syk/common/errors';

export class ErrorValidator {
  @orThrowError(BadRequestException)
  static orThrowBadRequestError(response: any, messageError: string) {}
}
```