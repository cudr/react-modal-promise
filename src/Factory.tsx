import * as React from "react";
import hexGen, { Hex } from "./hexGen";

export type FactoryOptions = {
  exitTimeout?: number;
  enterTimeout?: number;
};

export type Component = React.ComponentType<{}>;

export type FactoryState = {
  instances: {
    [key: string]: {
      Component: Component;
      props: FactoryOptions & any;
      resolve: any;
    } & any;
  };
  hashStack: Hex[];
};

class Factory extends React.PureComponent<{}, FactoryState> {
  public factoryContainer?: HTMLDivElement | null;

  private defaultOptions: FactoryOptions = {
    exitTimeout: 500,
    enterTimeout: 50
  };

  state: FactoryState = {
    instances: {},
    hashStack: []
  };

  componentWillUnmount() {
    Object.values(this.state.instances).forEach(instance => instance.resolve());
  }

  render() {
    return <div ref={this.factoryRef}>{this.getInstances()}</div>;
  }

  private factoryRef = (node: HTMLDivElement) => {
    this.factoryContainer = node;
  };

  private getInstances = () => {
    const keys = Object.keys(this.state.instances);

    const mapKeys = keys.map(key => {
      const { Component, props, resolve } = this.state.instances[key];

      return (
        <Component
          {...props}
          key={key}
          close={resolve}
          open={Boolean(this.state.hashStack.find(h => h === key))}
        />
      );
    });

    return mapKeys;
  };

  public create = (Component: Component, options = {}) => (props: any) =>
    new Promise(promiseResolve => {
      const hash = hexGen();
      const itemOptions = { ...this.defaultOptions, ...options };

      const resolve = (value: any) => {
        this.delete(hash);
        promiseResolve(value);
      };

      this.setState(
        {
          instances: {
            [hash]: {
              Component,
              props: { ...itemOptions, ...props },
              resolve,
              ...itemOptions
            },
            ...this.state.instances
          }
        },
        () => {
          setTimeout(() => {
            this.setState({ hashStack: [...this.state.hashStack, hash] });
          }, itemOptions.enterTimeout);
        }
      );
    });

  private delete = (hash: Hex): void => {
    const {
      instances: { [hash]: target }
    } = this.state;
    const exitTimeout = target && target.exitTimeout;
    this.setState(
      {
        hashStack: this.state.hashStack.filter(h => h !== hash)
      },
      () => {
        setTimeout(this.omitState, exitTimeout, hash);
      }
    );
  };

  private omitState = (hash: Hex) => {
    const { [hash]: _, ...instances } = this.state.instances;
    this.setState({ instances });
  };
}

export default Factory;
