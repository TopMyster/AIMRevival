import { Wallpaper, Window } from 'react-windows-xp'
import Login from './Login'
import { useState } from 'react'
import Chat from './Chat'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function App() {
  const [isLogin, setIsLogin] = useState(false)

  function onFinish() {
    setIsLogin(true)
  }

  return (
    <Wallpaper fullScreen>
      {isLogin ? (
        <Window title="Chat" style={{ width: '1200px', height: '700px', margin: '15px' }}>
          <Chat />
        </Window>
      ) : (
        <Window title="Login" style={{ width: '350px', height: '600px', margin: '15px' }}>
          <Login onFinish={onFinish} />
        </Window>
      )}
    </Wallpaper>
  )
}
