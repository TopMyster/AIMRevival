import { useState } from 'react'
import { supabase } from './supabaseClient'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAction = async () => {
        setError("");
        setLoading(true);

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: displayName
                    }
                }
            });
            if (error) setError(error.message);
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
        }

        setLoading(false);
    }

    return (
        <div style={{ padding: '20px' }} onMouseDown={(e) => e.stopPropagation()}>
            <p>Welcome to AIM Revival. {isSignUp ? "Create an account." : "Sign in to continue."}</p>

            {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '11px' }}>{error}</p>}

            {isSignUp && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Display Name:</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="supabase-auth-ui_ui-input"
                        style={{ width: '100%' }}
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                    />
                </div>
            )}

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    className="supabase-auth-ui_ui-input"
                    style={{ width: '100%' }}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="supabase-auth-ui_ui-input"
                    style={{ width: '100%' }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <button
                    className="supabase-auth-ui_ui-button"
                    onClick={handleAction}
                    disabled={loading || !email || !password || (isSignUp && !displayName)}
                >
                    {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Log In")}
                </button>

                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#0000ff',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '11px'
                    }}
                    onClick={() => setIsSignUp(!isSignUp)}
                >
                    {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
                </button>
            </div>
        </div>
    );
}

export default Login;