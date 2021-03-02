import React from 'react';
import { mount } from 'enzyme';
import {
  configureContext,
  ContainerProvider,
  useCradle,
} from '@jishida/react-awilix';
import { asValue, createContainer } from 'awilix';

beforeAll(() => {
  configureContext((id) => {
    const container = createContainer();
    if (id === undefined) {
      container.register('text', asValue('default'));
      return container;
    }
    if (id === 'NAMED_ID') {
      container.register('text', asValue('named'));
      return container;
    }
    return undefined;
  });
});

test(`configureContext - useCradle`, () => {
  const containerDefault = createContainer();
  containerDefault.register('text', asValue('default provided'));

  const containerNamed = createContainer();
  containerNamed.register('text', asValue('named provided'));

  function Hook({ contextId }: { contextId?: string }) {
    const cradle = useCradle(contextId);
    return <p>{cradle.text}</p>;
  }

  const Component = () => (
    <div>
      <ContainerProvider container={containerDefault}>
        <Hook />
        <Hook contextId='NAMED_ID' />
      </ContainerProvider>
      <ContainerProvider contextId='NAMED_ID' container={containerNamed}>
        <Hook contextId='NAMED_ID' />
        <Hook />
      </ContainerProvider>
    </div>
  );

  const wrapper = mount(<Component />);
  expect(wrapper.find('p').length).toBe(4);
  expect(wrapper.find('p').at(0).text()).toBe('default provided');
  expect(wrapper.find('p').at(1).text()).toBe('named');
  expect(wrapper.find('p').at(2).text()).toBe('named provided');
  expect(wrapper.find('p').at(3).text()).toBe('default');
});
