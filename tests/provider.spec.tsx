import React from 'react';
import { mount } from 'enzyme';
import {
  useCradle,
  useContainer,
  CradleConsumer,
  ContainerConsumer,
  ContainerProvider,
} from '@jishida/react-awilix';
import { asValue, AwilixContainer, createContainer } from 'awilix';

const containerDefault = createContainer();
containerDefault.register('value', asValue('default'));
const containerNamed = createContainer();
containerNamed.register('value', asValue('named'));

const containerDefaultNest = createContainer();
containerDefaultNest.register('value', asValue('default nest'));
const containerNamedNest = createContainer();
containerNamedNest.register('value', asValue('named nest'));

test(`ContainerProvider - useContainer`, () => {
  const initialContainers: {
    [s: string]: AwilixContainer<{ value: string }>;
  } = {};
  const nestContainers: {
    [s: string]: AwilixContainer<{ value: string }>;
  } = {};
  const Hook = ({ containers }: { containers: any }) => {
    containers.default = useContainer();
    containers.named = useContainer('NAMED_ID');

    return (
      <ul>
        <li>{containers.default.cradle.value}</li>
        <li>{containers.named.cradle.value}</li>
      </ul>
    );
  };
  const wrapper = mount(
    <ContainerProvider container={containerDefault}>
      <ContainerProvider contextId='NAMED_ID' container={containerNamed}>
        <Hook containers={initialContainers} />
        <ContainerProvider container={containerDefaultNest}>
          <ContainerProvider
            contextId='NAMED_ID'
            container={containerNamedNest}
          >
            <Hook containers={nestContainers} />
          </ContainerProvider>
        </ContainerProvider>
      </ContainerProvider>
    </ContainerProvider>
  );

  expect(initialContainers.default).toBe(containerDefault);
  expect(initialContainers.named).toBe(containerNamed);
  expect(nestContainers.default).toBe(containerDefaultNest);
  expect(nestContainers.named).toBe(containerNamedNest);

  expect(wrapper.find('li').length).toBe(4);
  expect(wrapper.find('li').at(0).text()).toBe('default');
  expect(wrapper.find('li').at(1).text()).toBe('named');
  expect(wrapper.find('li').at(2).text()).toBe('default nest');
  expect(wrapper.find('li').at(3).text()).toBe('named nest');
});

test(`ContainerProvider - useCradle`, () => {
  const initialCradles: { [s: string]: { value: string } } = {};
  const nestCradles: { [s: string]: { value: string } } = {};
  const Hook = ({ cradles }: { cradles: any }) => {
    cradles.default = useCradle();
    cradles.named = useCradle('NAMED_ID');

    return (
      <ul>
        <li>{cradles.default.value}</li>
        <li>{cradles.named.value}</li>
      </ul>
    );
  };
  const wrapper = mount(
    <ContainerProvider container={containerDefault}>
      <ContainerProvider contextId='NAMED_ID' container={containerNamed}>
        <Hook cradles={initialCradles} />
        <ContainerProvider container={containerDefaultNest}>
          <ContainerProvider
            contextId='NAMED_ID'
            container={containerNamedNest}
          >
            <Hook cradles={nestCradles} />
          </ContainerProvider>
        </ContainerProvider>
      </ContainerProvider>
    </ContainerProvider>
  );

  expect(initialCradles.default).toBe(containerDefault.cradle);
  expect(initialCradles.named).toBe(containerNamed.cradle);
  expect(nestCradles.default).toBe(containerDefaultNest.cradle);
  expect(nestCradles.named).toBe(containerNamedNest.cradle);

  expect(wrapper.find('li').length).toBe(4);
  expect(wrapper.find('li').at(0).text()).toBe('default');
  expect(wrapper.find('li').at(1).text()).toBe('named');
  expect(wrapper.find('li').at(2).text()).toBe('default nest');
  expect(wrapper.find('li').at(3).text()).toBe('named nest');
});

test(`ContainerProvider - ContainerConsumer`, () => {
  const initialContainers: {
    [s: string]: AwilixContainer<{ value: string }>;
  } = {};
  const nestContainers: {
    [s: string]: AwilixContainer<{ value: string }>;
  } = {};
  const Consume = ({ containers }: { containers: any }) => (
    <ul>
      <li>
        <ContainerConsumer>
          {(container: AwilixContainer<{ value: string }>) => {
            containers.default = container;
            return container.cradle.value;
          }}
        </ContainerConsumer>
      </li>
      <li>
        <ContainerConsumer contextId='NAMED_ID'>
          {(container: AwilixContainer<{ value: string }>) => {
            containers.named = container;
            return container.cradle.value;
          }}
        </ContainerConsumer>
      </li>
    </ul>
  );

  const wrapper = mount(
    <ContainerProvider container={containerDefault}>
      <ContainerProvider contextId='NAMED_ID' container={containerNamed}>
        <Consume containers={initialContainers} />
        <ContainerProvider container={containerDefaultNest}>
          <ContainerProvider
            contextId='NAMED_ID'
            container={containerNamedNest}
          >
            <Consume containers={nestContainers} />
          </ContainerProvider>
        </ContainerProvider>
      </ContainerProvider>
    </ContainerProvider>
  );

  expect(initialContainers.default).toBe(containerDefault);
  expect(initialContainers.named).toBe(containerNamed);
  expect(nestContainers.default).toBe(containerDefaultNest);
  expect(nestContainers.named).toBe(containerNamedNest);

  expect(wrapper.find('li').length).toBe(4);
  expect(wrapper.find('li').at(0).text()).toBe('default');
  expect(wrapper.find('li').at(1).text()).toBe('named');
  expect(wrapper.find('li').at(2).text()).toBe('default nest');
  expect(wrapper.find('li').at(3).text()).toBe('named nest');
});

test(`ContainerProvider - CradleConsumer`, () => {
  const initialCradles: {
    [s: string]: { value: string };
  } = {};
  const nestCradles: {
    [s: string]: { value: string };
  } = {};
  const Consume = ({ cradles }: { cradles: any }) => (
    <ul>
      <li>
        <CradleConsumer>
          {(cradle: { value: string }) => {
            cradles.default = cradle;
            return cradle.value;
          }}
        </CradleConsumer>
      </li>
      <li>
        <CradleConsumer contextId='NAMED_ID'>
          {(cradle: { value: string }) => {
            cradles.named = cradle;
            return cradle.value;
          }}
        </CradleConsumer>
      </li>
    </ul>
  );

  const wrapper = mount(
    <ContainerProvider container={containerDefault}>
      <ContainerProvider contextId='NAMED_ID' container={containerNamed}>
        <Consume cradles={initialCradles} />
        <ContainerProvider container={containerDefaultNest}>
          <ContainerProvider
            contextId='NAMED_ID'
            container={containerNamedNest}
          >
            <Consume cradles={nestCradles} />
          </ContainerProvider>
        </ContainerProvider>
      </ContainerProvider>
    </ContainerProvider>
  );

  expect(initialCradles.default).toBe(containerDefault.cradle);
  expect(initialCradles.named).toBe(containerNamed.cradle);
  expect(nestCradles.default).toBe(containerDefaultNest.cradle);
  expect(nestCradles.named).toBe(containerNamedNest.cradle);

  expect(wrapper.find('li').length).toBe(4);
  expect(wrapper.find('li').at(0).text()).toBe('default');
  expect(wrapper.find('li').at(1).text()).toBe('named');
  expect(wrapper.find('li').at(2).text()).toBe('default nest');
  expect(wrapper.find('li').at(3).text()).toBe('named nest');
});
