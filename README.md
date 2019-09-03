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

(You need pass ```open: boolean``` flag to you Modal component)

Possible to close modal and resolve Promise using close() function from props

```tsx
import { createModal } from 'react-modal-promise'
import { Modal } from 'react-bootstrap'

const MyModal = ({ open: boolean, close: (params: any /*...any params passed to modal*/) }) => (
  <Modal open={open} onHide={() => close()}>
    My Super Promised modal
    <button onClick={() => close(/*pass any value*/)}>Confirm modal</button>
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
  // get value that you pass to 'close' function
})
```

## Features

You can use react-modal-promise with any theming (Bootstrap or material-ui, styled-components, or other), all instances works perfectly!
