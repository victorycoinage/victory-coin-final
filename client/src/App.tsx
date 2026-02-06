import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { TronWeb } from 'tronweb';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION (YOUR CREDENTIALS) ---
const SUPABASE_URL = "https://tqthisqhereccvgwawtz.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_NdG9P6sTsZOEHgrv6RPiSg_8S4L2PU1";
// -------------------------------------------------

// --- BLOCKCHAIN CONFIGURATION ---
const TOKEN_ADDRESS = "TFhNSWsP6DRKJQveFzQKkWbFckceF7ZpVP"; 
const FACTORY_ADDRESS = "TCnirA41H7XjCndv2NKzDma5ZXTLsQ8Uag"; 
const STORE_WALLET = "TV5644bA11tQPVKk1koRz2sBrvvgvbUqs4";
// --------------------------------

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

declare global { interface Window { tronWeb: any; } }

// ==========================================
// 1. LOGIN PAGE
// ==========================================
const LoginPage = ({ onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Account created! You can now log in.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    }
    setLoading(false);
  }

  return (
    <div style={pageStyle}>
      <div style={{background:'white', color:'black', padding:'40px', borderRadius:'20px', width:'300px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <h2 style={{margin:'0 0 20px 0'}}>🔐 Victory Access</h2>
        <input style={inputStyle} placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input style={inputStyle} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        
        <button onClick={handleAuth} style={actionBtnStyle} disabled={loading}>
          {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Log In")}
        </button>
        
        <p style={{marginTop:'15px', cursor:'pointer', color:'#555', fontSize:'14px'}} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Have an account? Log In" : "Need an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 2. LIQUIDITY GUIDE
// ==========================================
const LiquidityGuide = ({ setPage }: any) => (
  <div style={{...pageStyle, justifyContent: 'flex-start', paddingTop: '50px'}}>
    <div style={{maxWidth:'600px', textAlign:'left', padding:'20px'}}>
      <h1>🌊 How to Add Liquidity</h1>
      <p style={{color:'#ccc'}}>To give Victory Coin a real price, you must add funds to a Liquidity Pool.</p>
      
      <div style={{background:'#1e1e1e', padding:'25px', borderRadius:'15px', marginTop:'20px', border:'1px solid #333'}}>
        <h3>Step 1: Go to SunSwap</h3>
        <p>Visit <a href="https://sun.io/?lang=en-US#/v2/pool" target="_blank" style={{color:'#4fc3f7'}}>Sun.io V2 Pool</a>. Connect your TronLink wallet.</p>
        
        <h3>Step 2: Create a Pair</h3>
        <p>Click <strong>"Add Liquidity"</strong>.</p>
        <ul>
          <li>Token 1: Select <strong>TRX</strong></li>
          <li>Token 2: Paste your address: <br/><code style={{background:'#000', padding:'2px 5px', borderRadius:'3px'}}>{TOKEN_ADDRESS}</code></li>
        </ul>
        
        <h3>Step 3: Set the Price</h3>
        <p>Decide the initial value. For example:</p>
        <ul>
          <li>Add <strong>1,000,000 VIC</strong></li>
          <li>Add <strong>1,000 TRX</strong> (~$150 USD)</li>
        </ul>
        <p style={{fontSize:'12px', color:'#aaa'}}>*This sets the price at 0.001 TRX per VIC.</p>
        
        <button style={{...actionBtnStyle, marginTop:'10px'}} onClick={() => window.open('https://sun.io/?lang=en-US#/v2/pool', '_blank')}>
          Open SunSwap Pool
        </button>
      </div>
      <button style={{...navBtnStyle, marginTop:'20px'}} onClick={() => setPage('home')}>Back to Dashboard</button>
    </div>
  </div>
);

// ==========================================
// 3. LANDING PAGE / DASHBOARD
// ==========================================
const LandingPage = ({ setPage, user, doLogout }: any) => (
  <div style={pageStyle}>
    <div style={{position:'absolute', top:20, right:20, fontSize:'12px', textAlign:'right'}}>
      <div style={{marginBottom:'5px'}}>{user.email}</div>
      <button onClick={doLogout} style={{padding:'5px 10px', cursor:'pointer', background:'#333', color:'white', border:'none', borderRadius:'5px'}}>Logout</button>
    </div>

    <h1 style={{fontSize:'50px', margin:'0'}}>💎 Victory Coin</h1>
    <p style={{color:'#888', marginTop:'10px'}}>The future of decentralized payments.</p>
    
    <div style={{display:'flex', gap:'20px', marginTop:'40px', flexWrap:'wrap', justifyContent:'center'}}>
      
      {/* Merchant Card */}
      <div style={cardStyle}>
        <h3>☕ Merchant POS</h3>
        <p style={{fontSize:'13px', color:'#aaa'}}>Accept payments in VIC via QR Code.</p>
        <button style={actionBtnStyle} onClick={() => setPage('pos')}>Launch POS</button>
      </div>

      {/* Admin Card */}
      <div style={cardStyle}>
        <h3>🏭 Admin Factory</h3>
        <p style={{fontSize:'13px', color:'#aaa'}}>Mint new tokens on the blockchain.</p>
        <button style={actionBtnStyle} onClick={() => setPage('admin')}>Open Factory</button>
      </div>

      {/* Guide Card */}
      <div style={cardStyle}>
        <h3>🌊 Add Liquidity</h3>
        <p style={{fontSize:'13px', color:'#aaa'}}>Learn how to add value to your coin.</p>
        <button style={actionBtnStyle} onClick={() => setPage('guide')}>Read Guide</button>
      </div>

    </div>
  </div>
);

// ==========================================
// 4. MERCHANT POS
// ==========================================
const MerchantPOS = ({ setPage }: any) => {
  const [amount, setAmount] = useState("10");
  const [isWaiting, setIsWaiting] = useState(false);
  const [initial, setInitial] = useState(0);
  const [receipt, setReceipt] = useState<any>(null);

  async function checkBalance() {
    try {
      // Using Public API to prevent wallet conflicts
      const res = await fetch(`https://nileapi.tronscan.org/api/token_trc20/holders?contract_address=${TOKEN_ADDRESS}&holder_address=${STORE_WALLET}`);
      const data = await res.json();
      if (data.trc20_tokens?.[0]) return parseFloat(data.trc20_tokens[0].balance) / 1e18;
      return 0;
    } catch { return -1; }
  }

  async function start() {
    const bal = await checkBalance();
    if (bal === -1) return alert("API Error. Check Internet.");
    setInitial(bal);
    setIsWaiting(true);
  }

  useEffect(() => {
    let interval: any;
    if (isWaiting) {
      interval = setInterval(async () => {
        const now = await checkBalance();
        if (now > initial + 0.000001) { // Slight buffer for float math
          setIsWaiting(false);
          setReceipt({ amt: now - initial, date: new Date().toLocaleString() });
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isWaiting, initial]);

  if (receipt) return (
    <div style={pageStyle}>
      <div style={{background:'white', color:'black', padding:'40px', borderRadius:'20px', width:'320px', textAlign:'center'}}>
        <div style={{fontSize:'60px'}}>✅</div>
        <h1 style={{margin:0, color:'#2e7d32'}}>Payment Success</h1>
        <hr style={{margin:'20px 0', border:'1px solid #eee'}}/>
        <p><strong>Amount:</strong> {receipt.amt.toFixed(2)} VIC</p>
        <p><strong>Date:</strong> {receipt.date}</p>
        <button style={actionBtnStyle} onClick={() => {setReceipt(null);}}>Next Customer</button>
      </div>
    </div>
  );

  return (
    <div style={{...pageStyle, background: isWaiting ? '#1565c0' : '#121212', transition:'background 0.5s'}}>
      <div style={{background:'white', color:'black', padding:'30px', borderRadius:'20px', width:'300px', textAlign:'center'}}>
        <h2 style={{margin:'0 0 10px 0'}}>☕ Victory Café</h2>
        {!isWaiting ? (
          <>
            <input style={inputStyle} type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            <button style={actionBtnStyle} onClick={start}>Generate Bill</button>
          </>
        ) : (
          <>
            <div style={{background:'#fff', padding:'10px', display:'inline-block'}}><QRCodeCanvas value={STORE_WALLET} size={180} /></div>
            <p style={{color:'white', fontWeight:'bold', fontSize:'14px'}}>Scanning for {amount} VIC...</p>
            <button style={{...actionBtnStyle, background:'#ccc', color:'#333'}} onClick={() => setIsWaiting(false)}>Cancel</button>
          </>
        )}
      </div>
      <button style={{...navBtnStyle, marginTop:'20px'}} onClick={() => setPage('home')}>Exit POS</button>
    </div>
  );
};

// ==========================================
// 5. ADMIN FACTORY
// ==========================================
const AdminFactory = ({ setPage }: any) => {
  const [form, setForm] = useState({ name: '', symbol: '', supply: 1000000 });
  async function createToken() {
    if (!window.tronWeb) return alert("Please open TronLink");
    try {
      const contract = await window.tronWeb.contract().at(FACTORY_ADDRESS);
      await contract.deployToken(form.name, form.symbol, form.supply).send({ feeLimit: 400000000 });
      alert("Token Created! Check TronScan.");
    } catch (e: any) { alert("Error: " + e.message); }
  }
  return (
    <div style={pageStyle}>
      <h2>🏭 Token Factory</h2>
      <div style={{background:'#fff', color:'#000', padding:'30px', borderRadius:'20px', width:'300px'}}>
        <input style={inputStyle} placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
        <input style={inputStyle} placeholder="Symbol" onChange={e => setForm({...form, symbol: e.target.value})} />
        <input style={inputStyle} type="number" value={form.supply} onChange={e => setForm({...form, supply: parseInt(e.target.value)})} />
        <button style={actionBtnStyle} onClick={createToken}>🚀 Mint Coin</button>
      </div>
      <button style={{...navBtnStyle, marginTop:'20px'}} onClick={() => setPage('home')}>Back Home</button>
    </div>
  );
};

// ==========================================
// MASTER APP CONTROLLER
// ==========================================
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [page, setPage] = useState('home');

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // If not logged in, show Login Page
  if (!session) return <LoginPage />;

  // If logged in, show the Router
  return (
    <>
      {page === 'home' && <LandingPage setPage={setPage} user={session.user} doLogout={() => supabase.auth.signOut()} />}
      {page === 'admin' && <AdminFactory setPage={setPage} />}
      {page === 'pos' && <MerchantPOS setPage={setPage} />}
      {page === 'guide' && <LiquidityGuide setPage={setPage} />}
    </>
  );
}

// --- GLOBAL STYLES ---
const pageStyle: any = { minHeight:'100vh', background:'#121212', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'20px' };
const cardStyle: any = { background:'#1e1e1e', padding:'20px', borderRadius:'15px', width:'250px', display:'flex', flexDirection:'column', justifyContent:'space-between', border:'1px solid #333' };
const inputStyle: any = { width:'100%', padding:'12px', fontSize:'16px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ccc', boxSizing:'border-box', background:'#f9f9f9' };
const actionBtnStyle: any = { width:'100%', padding:'12px', background:'black', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', fontWeight:'bold', cursor:'pointer' };
const navBtnStyle: any = { padding:'10px 20px', background:'#333', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' };