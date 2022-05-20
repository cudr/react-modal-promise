## Install
```sh
npm install react-modal-promise
```
or
```sh
yarn add react-modal-promise
```

## How to use:

1. Place ModalContainer in any place of your App, it will emit new modal instances:

```tsx
import { Container as ModalContainer } from 'react-modal-promise'

class MyApp extends React.Component {
  render () {
    return (
      <ModalContainer />
    )
  }
}
```

2. Create you own modal component:

(You should pass ```isOpen: boolean``` flag to you Modal component)

You can resolve or reject Promise with onResolve() or onReject() callback from props:

```tsx
import { create } from 'react-modal-promise'
import { Modal } from 'react-bootstrap'

const MyModal = ({ isOpen, onResolve, onReject }) => (
  <Modal open={isOpen} onHide={() => onReject()}>
    My Super Promised modal
    <button onClick={() => onResolve(/*pass any value*/)}>Confirm modal</button>
    <button onClick={() => onReject(/*throw any error*/)}>Reject modal</button>
  </Modal>
)
```

And wrap it:

```tsx
export const myPromiseModal = create(MyModal)
```

3. Use the modal as a Promise everywhere:

```tsx
myPromiseModal({ /*pass any props there*/ })
  .then(value => {
    // get value that you passed to 'onResolve' function
  }).catch(error => {
    // get error that you passed to 'onReject' function
  })
```

## ModalContainer props

```tsx
import { Container as ModalContainer } from 'react-modal-promise';

function App() {
  function onOpen(modalId) {
    // do something when modal open
  }
  function onRemove(modalId) {
    // do something when modal closes
  }
  function onResolve() {
    // do something if modal resolved
  }
  function onReject() {
    // do something if modal rejected
  }

  return (
    <>
      <ModalContainer
        onOpen={onOpen}
        onRemove={onRemove}
        onResolve={onResolve}
        onReject={onReject}
        isAppendIntances
      />
      {/* other application */}
    </>
  );
}
```

## Examples

Simple:

[![Edit react-modal-promise-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-modal-promise-example-w6jq5f)

With hook and route control:

[![Edit react-modal-promise-router-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-modal-promise-router-example-jhtet?fontsize=14&hidenavigation=1&theme=dark)

Use multiple scopes:

[![Edit react-modal-promise-multiple-scopes-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-modal-promise-example-wmvmt?fontsize=14&hidenavigation=1&theme=dark)


## Features

You can use react-modal-promise with any theming (Bootstrap or material-ui, styled-components, or other), all instances work great!

