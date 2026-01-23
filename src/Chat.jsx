import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'
import { Button } from 'react-windows-xp'

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [user, setUser] = useState(null)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true })

            if (data) setMessages(data)
            if (error) console.error('Error fetching messages:', error)
        }
        fetchMessages()

        const interval = setInterval(() => {
            fetchMessages()
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const { error } = await supabase
            .from('messages')
            .insert([
                {
                    content: newMessage,
                    user_name: user?.user_metadata.full_name
                }
            ])

        if (error) {
            console.error('Error sending message:', error)
        } else {
            setNewMessage('')
        }
    }

    return (
        <div
            className="chat-container"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div
                ref={scrollRef}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #7f9db9',
                    padding: '10px',
                    fontSize: 20,
                    marginBottom: '10px',
                    fontFamily: 'Times New Roman'
                }}
            >
                {messages.length === 0 ? (
                    <p style={{ color: '#888' }}>No messages yet. Say hello!</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} style={{ marginBottom: '8px' }}>
                            <strong style={{ color: msg.user_name === user?.user_metadata.full_name ? '#0000ff' : '#ff0000' }}>
                                {msg.user_name}:
                            </strong>
                            <span style={{ marginLeft: '8px' }}>{msg.content}</span>
                        </div>
                    ))
                )}
            </div>

            <form
                onSubmit={sendMessage}
                style={{ display: 'flex', gap: '8px' }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='user-chat'>
                    <textarea
                        className="supabase-auth-ui_ui-input"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        autoFocus
                        style={{
                            width: '100%',
                            height: '100%',
                            padding: '10px',
                            fontSize: 20,
                            fontFamily: 'Times New Roman'
                        }}
                    />
                </div>
                <Button type="submit">Send</Button>
            </form>
        </div>
    )
}