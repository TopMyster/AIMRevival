import { Wallpaper, Window } from 'react-windows-xp'
import Login from './Login'
import { useState, useEffect } from 'react'
import Chat from './Chat'
import { supabase } from './supabaseClient'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <Wallpaper fullScreen>
        <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'XP' }}>
          Loading...
        </div>
      </Wallpaper>
    )
  }

  return (
    <Wallpaper fullScreen>
      {!session ? (
        <Window title="Login" style={{ width: '350px', height: '400px', margin: '15px' }}>
          <Login />
        </Window>
      ) : (
        <Window title="Chat" style={{ width: '1200px', height: '700px', margin: '15px' }}>
          <Chat />
        </Window>
      )}
    </Wallpaper>
  )
}