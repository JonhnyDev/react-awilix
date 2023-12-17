# React Awilix

[![npm version](https://img.shields.io/npm/v/react-awilix)](https://www.npmjs.com/package/react-awilix)
[![CI](https://github.com/jishida/react-mvvm/actions/workflows/ci.yml/badge.svg)](https://github.com/jishida/react-awilix/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/jishida/react-awilix/badge.svg?branch=master)](https://coveralls.io/github/jishida/react-awilix?branch=master)
[![license: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](http://www.apache.org/licenses/LICENSE-2.0)

React.Context wrapper that passes AwilixContainer to components.

## Installation

```bash
npm install react-awilix
```

or

```bash
yarn add react-awilix
```

## Requirements

- react >=16.8.0 || >=17.0.0 or preact >=10.0.0
- awilix >=4.2.5 (awilix requires several es6 objects such as Proxy, Reflect, and Symbol)

## Usage

```typescript
import React from 'react';
import { createContainer, asClass } from 'awilix';
import { ContainerProvider, useCradle } from 'react-awilix';

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
