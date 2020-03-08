## Install
```
npm install react-modal-promise
```
or
```
yarn add react-modal-promise
```

## How to use:

1. Place ModalContainer in root of your App:

```tsx
import ModalContainer from 'react-modal-promise'

class MyApp extends React.Component {
  render () {
    return (
      <ModalContainer />
    )
  }
}
```

2. Create you own modal component:

(You need pass ```isOpen: boolean``` flag to you Modal component)

Possible to close modal and resolve Promise using onResolve() function from props

```tsx
import { createModal } from 'react-modal-promise'
import { Modal } from 'react-bootstrap'

const MyModal = ({ isOpen: boolean, onResolve: (params: any /*...any params passed to modal*/) }) => (
  <Modal open={isOpen} onHide={() => onResolve()}>
    My Super Promised modal
    <button onClick={() => onResolve(/*pass any value*/)}>Confirm modal</button>
  </Modal>
)
```

And wrap it:

```tsx
const myPromiseModal = createModal(MyModal)

```

3. Use modal as Promise everywhere:

```tsx
myPromiseModal({ /*pass any props here*/ }).then(value => {
  // get value that you passed to 'close' function
})
```

## Examples

Simple:

[![Edit react-modal-promise-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-modal-promise-example-by2pd?fontsize=14&hidenavigation=1&theme=dark)

With hook and route control:

[![Edit react-modal-promise-router-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-modal-promise-router-example-jhtet?fontsize=14&hidenavigation=1&theme=dark)

Use multiple scopes:

[![Edit react-modal-promise-multiple-scopes-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-modal-promise-example-wmvmt?fontsize=14&hidenavigation=1&theme=dark)


## Features

You can use react-modal-promise with any theming (Bootstrap or material-ui, styled-components, or other), all instances works perfectly!


