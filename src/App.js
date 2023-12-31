import React from 'react'
import {IntlProvider, addLocaleData} from 'react-intl'

import Layouts from './components/Layouts'
import '../src/styles/global.scss'

function App() {
  return (
    <Layouts>
      <div className="App"></div>
    </Layouts>
  )
}

export default App
