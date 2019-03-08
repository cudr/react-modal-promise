import * as React from "react";

declare module "react-modal-promise" {
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
  const PromiseModal: React.SFC<{}>;
  export type InjectedModalProps<Result> = {
    open: boolean,
    close: (result: Result) => void,
  }
  interface CreateModal {
    <T extends InjectedModalProps<Result>, Result = boolean>(
      Component: React.ComponentType<T>,
      options?: {
        exitTimeout?: number;
        enterTimeout?: number;
      }
    ): (props: Omit<T, 'open' | 'close'>) => Result;
  }

  export default PromiseModal;
  export const createModal: CreateModal;
}
