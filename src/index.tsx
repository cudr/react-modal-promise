import React from "react";
import ModalFactory from "./Factory";

export type Scope = string;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type InjectedModalProps<Result> = {
  open: boolean;
  close: (result: Result) => void;
};

export type ModalOptions = {
  scope?: Scope;
  exitTimeout?: number;
  enterTimeout?: number;
};

export type ControllerPropsModel = {
  scope?: Scope;
};

export interface CreateModalModel {
  <T extends InjectedModalProps<Result>, Result = boolean>(
    Component: React.ComponentType<T>,
    options?: ModalOptions
  ): (props: Omit<T, "open" | "close">) => Promise<Result>;
}

interface FactoryStackModel {
  [key: string]: any;
}

declare global {
  interface Window {
    factoryStack: FactoryStackModel;
  }
}

const defaultScope: Scope = "stack";

let factoryStack: FactoryStackModel = {};

if (typeof window !== "undefined") {
  if (!window.factoryStack) {
    window.factoryStack = {};
  }

  factoryStack = window.factoryStack;
}

const PromiseFactoryContainer = ({
  scope = defaultScope,
  ...rest
}: ControllerPropsModel) => (
  <ModalFactory
    {...rest}
    ref={(node: ModalFactory) => {
      factoryStack[scope] = node;
    }}
  />
);

PromiseFactoryContainer.defaultProps = {
  scope: defaultScope
};

const createModal: CreateModalModel = (Component, options) => props =>
  factoryStack[(options && options.scope) || defaultScope].create(
    Component,
    options
  )(props);

export default PromiseFactoryContainer;

export { createModal };
