import {
  createContext,
  createElement,
  memo,
  useContext,
  ReactNode,
  Context,
  FunctionComponent,
} from 'react';
import { AwilixContainer, createContainer } from 'awilix';

export type ContextId = string | number | symbol;

export interface ContainerProviderProps {
  contextId?: ContextId;
  container: AwilixContainer;
  children: ReactNode;
}

export interface ContainerConsumerProps<Cradle extends object = any> {
  contextId?: ContextId;
  children: (container: AwilixContainer<Cradle>) => ReactNode;
}

export interface CradleConsumerProps<Cradle extends object = any> {
  contextId?: ContextId;
  children: (cradle: Cradle) => ReactNode;
}

interface ContainerStore {
  container?: AwilixContainer;
}

interface Config {
  _factory?: (contextId?: ContextId) => AwilixContainer | undefined;
}

const config: Config = {};

const DefaultContext = createContext<ContainerStore>({});

const contextMap = new Map<ContextId, Context<ContainerStore>>();

function getContext(contextId?: ContextId): Context<ContainerStore> {
  if (contextId === undefined) {
    return DefaultContext;
  }
  let ctx = contextMap.get(contextId);
  if (ctx === undefined) {
    ctx = createContext<ContainerStore>({});
    contextMap.set(contextId, ctx);
  }
  return ctx;
}

export function configureContext(
  factory:
    | ((contextId?: ContextId) => AwilixContainer | void | undefined)
    | undefined
) {
  config._factory = factory as (
    contextId?: ContextId
  ) => AwilixContainer | undefined;
}

const _ContainerProvider: FunctionComponent<ContainerProviderProps> = ({
  contextId,
  container,
  children,
}: ContainerProviderProps) => {
  const ctx = getContext(contextId);
  return createElement(ctx.Provider, { value: { container } }, children);
};

_ContainerProvider.displayName = 'ContainerProvider';

export const ContainerProvider = memo(_ContainerProvider);

function initializeStore(
  store: ContainerStore,
  contextId: ContextId | undefined
) {
  let container: AwilixContainer | undefined;
  if (config._factory) {
    container = config._factory(contextId);
  }
  if (!container) {
    container = createContainer();
  }
  store.container = container;
}

function createConsumerNode(
  store: ContainerStore,
  contextId: ContextId | undefined,
  mapper: (container: AwilixContainer) => ReactNode
) {
  if (!store.container) {
    initializeStore(store, contextId);
  }
  return mapper(store.container!);
}

export const ContainerConsumer: FunctionComponent<ContainerConsumerProps> = ({
  contextId,
  children,
}: ContainerConsumerProps) => {
  const ctx = getContext(contextId);
  return createElement(ctx.Consumer, null, (store: ContainerStore) =>
    createConsumerNode(store, contextId, children)
  );
};

ContainerConsumer.displayName = 'ContainerConsumer';

export const CradleConsumer: FunctionComponent<CradleConsumerProps> = ({
  contextId,
  children,
}: CradleConsumerProps) => {
  const ctx = getContext(contextId);
  return createElement(ctx.Consumer, null, (store: ContainerStore) =>
    createConsumerNode(store, contextId, (container: AwilixContainer) =>
      children(container.cradle)
    )
  );
};

CradleConsumer.displayName = 'CradleConsumer';

export function useContainer<Cradle extends object = any>(
  contextId?: ContextId
) {
  const ctx = getContext(contextId);
  const store = useContext(ctx);
  if (!store.container) {
    initializeStore(store, contextId);
  }
  return store.container as AwilixContainer<Cradle>;
}

export function useCradle<Cradle extends object = any>(contextId?: ContextId) {
  return useContainer(contextId).cradle as Cradle;
}
