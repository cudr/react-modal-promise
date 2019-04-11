import * as React from "react";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
declare module "react-modal-promise" {
  export type InjectedModalProps<Result> = {
    open: boolean;
    close: (result: Result) => void;
  };
  interface CreateModal {
    <T extends InjectedModalProps<Result>, Result = boolean>(
      Component: React.ComponentType<T>,
      options?: {
        exitTimeout?: number;
        enterTimeout?: number;
      }
    ): (props: Omit<T, "open" | "close">) => Result;
  }
  export const createModal: CreateModal;

  const PromiseModal: React.SFC<{}>;
  export default PromiseModal;
}
