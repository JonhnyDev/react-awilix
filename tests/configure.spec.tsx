import React from 'react';
import { mount } from 'enzyme';
import { configureContext, useContainer } from '@jishida/react-awilix';
import { asValue, AwilixContainer, createContainer } from 'awilix';

beforeAll(() => {
  configureContext((id) => {
    const container = createContainer();
    if (id === undefined) {
      container.register('value', asValue('default'));
      return container;
    }
    if (id === 'NAMED_ID') {
      container.register('value', asValue('named'));
      return container;
    }
    return undefined;
  });
});

test(`configureContext - unhandled id`, () => {
  const containers: { [s: string]: AwilixContainer } = {};
  const Component = () => {
    containers.default = useContainer();
    containers.named = useContainer('NAMED_ID');
    containers.unhandled = useContainer('UNHANDLED_ID');
    return null;
  };
  mount(<Component />);
  expect(Object.keys(containers.default.registrations)).toHaveLength(1);
  expect(Object.keys(containers.named.registrations)).toHaveLength(1);
  expect(Object.keys(containers.unhandled.registrations)).toHaveLength(0);
});
