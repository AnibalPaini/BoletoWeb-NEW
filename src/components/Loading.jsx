import React from 'react'
import {MoonLoader} from 'react-spinners';

const Loading = () => {
  return (
    <div className='contenedor-loading'>
      <MoonLoader
        size={80}
        color={"#123abc"}
        loading={true}
      />
    </div>
  )
}

export default Loading