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

```
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

You need pass (open: bool) flag to you Modal component

Close modal and resolve Promise by call close() function from props

```
import { createModal } from 'react-modal-promise'
import { Modal } from 'react-bootstrap'

const MyModal = ({ open: bool, close: function, /*...any props was passed to modal*/ }) => (
  <Modal open={open} onHide={() => close()}>
    My Super Promised modal
    <button onClick={() => close(/*pass any value*/)}>Confirm modal</button>
  </Modal>
)
```

And wrap it:

```
const myPromiseModal = createModal(MyModal)

```

3. Use modal as Promise everywhere:

```
myPromiseModal({ /*pass any props here*/ }).then(value => {
  // get value that you pass to 'close' function
})
```

## Features

You can use react-modal-promise with any theming (Bootstrap or material-ui, styled-components, or other), all instances works perfectly!
