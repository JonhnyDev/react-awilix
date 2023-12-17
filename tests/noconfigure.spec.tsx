import React from 'react';
import { mount } from 'enzyme';
import { useContainer } from 'react-awilix';
import { AwilixContainer } from 'awilix';

test(`no configure`, () => {
  const containers: { [s: string]: AwilixContainer } = {};
  const Component = () => {
    containers.default = useContainer();
    containers.named = useContainer('NAMED_ID');
    containers.unhandled = useContainer('UNHANDLED_ID');
    return null;
  };
  mount(<Component />);
  expect(Object.keys(containers.default.registrations)).toHaveLength(0);
  expect(Object.keys(containers.named.registrations)).toHaveLength(0);
  expect(Object.keys(containers.unhandled.registrations)).toHaveLength(0);
});
