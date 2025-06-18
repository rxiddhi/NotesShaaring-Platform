import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import NotesBrowsingPage from './NotesBrowsingPage'
import NotesUploadPage from './components/NotesUploadPage'
// import NoteCard from './NoteCard'
// import NotesGrid from '../NotesGrid'
// import NotesHeader from './NotesHeader'
// import NotesStats from './NotesStats'
// import SearchAndFilters
//  from './SearchAndFilters'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <NotesBrowsingPage/>
    <NotesUploadPage/>
    {/* <NoteCard/>
    <NotesGrid/>
    <NotesHeader/>
    <NotesStats/>
    <SearchAndFilters/> */}


    </>
  )
}

export default App
