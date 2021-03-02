# React Awilix

React.Context wrapper that passes AwilixContainer to components.

## Installation

```bash
npm install @jishida/react-awilix
```

or

```bash
yarn add @jishida/react-awilix
```

## Requirements

- react >=16.8.0 || >=17.0.0 or preact >=10.0.0
- awilix >=4.2.5 (awilix requires several es6 objects such as Proxy, Reflect, and Symbol)

## Usage

```typescript
import React from 'react';
import { createContainer, asClass } from 'awilix';
import { ContainerProvider, useCradle } from '@jishida/react-awilix';

import { ServiceClass } from './services';

const container = createContainer<{ service: ServiceClass }>();
container.register('service', asClass(ServiceClass).singleton());

function Button({ children }: { children: string }) {
  const { service } = useCradle<{ service: ServiceClass }>();
  return <button onClick={() => { service.runAction(); }}>{children}</button>;
}

ReactDOM.render(
  <ContainerProvider container={container}>
    <Button>run</Button>
  </ContainerProvider>,
  document.getElementById('root')
);
```

## License

React Awilix is licensed under the [Apache 2.0 License](https://github.com/jishida/react-awilix/blob/master/LICENSE)
