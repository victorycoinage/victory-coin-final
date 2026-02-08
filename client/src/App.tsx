import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { TronWeb } from 'tronweb';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 1. CONFIGURATION
// ==========================================

const SUPABASE_URL = "https://tqthisqhereccvgwawtz.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_NdG9P6sTsZOEHgrv6RPiSg_8S4L2PU1";
const STRIPE_LINK = "https://buy.stripe.com/28E5kwaPMg3v92Y8pz1Nu05";

const TOKEN_ADDRESS = "TFhNSWsP6DRKJQveFzQKkWbFckceF7ZpVP"; 
const FACTORY_ADDRESS = "TCnirA41H7XjCndv2NKzDma5ZXTLsQ8Uag"; 
const STORE_WALLET = "TV5644bA11tQPVKk1koRz2sBrvvgvbUqs4";

// --- 🔒 THE VIP LIST ---
const VIP_EMAILS = [
  "seereeuss@gmail.com",
  "ch7pbg@gmail.com",
  "blackpound2014@gmail.com",
  "uanjumathompson@ch7pbg.com"
]; 

// --- 🔑 THE SECRET ACCESS CODE ---
const SECRET_ACCESS_CODE = "VIC-PRO-2026";
// ------------------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
declare global { interface Window { tronWeb: any; } }

const TOKEN_ABI = [
  { "constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}], "type": "function" }
];

// ==========================================
// COMPONENTS
// ==========================================

// 1. LOGIN PAGE
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleAuth() {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("✅ Account created! Please check your email to verify.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: any) { alert(e.message); }
    setLoading(false);
  }

  return (
    <div style={pageStyle}>
      <div style={boxStyle}>
        <h2 style={{margin:'0 0 20px 0'}}>🔐 Victory Access</h2>
        <input style={inputStyle} placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input style={inputStyle} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleAuth} style={btnStyle} disabled={loading}>
          {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Log In")}
        </button>
        <p style={{marginTop:'15px', cursor:'pointer', color:'#555', fontSize:'13px'}} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Have an account? Log In" : "Need an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

// 2. LANDING PAGE / DASHBOARD (RENAMED FROM DASHBOARD TO FIX ERROR)
const LandingPage = ({ setPage, user, doLogout }: any) => {
  // Check VIP Status (Email List OR Local Access Code)
  const [hasCode, setHasCode] = useState(localStorage.getItem('vic_pro_unlocked') === 'true');
  const isVIP = VIP_EMAILS.includes(user.email) || hasCode;

  const handleRedeem = () => {
    const code = prompt("Enter Access Code:");
    if (code === SECRET_ACCESS_CODE) {
      localStorage.setItem('vic_pro_unlocked', 'true');
      setHasCode(true);
      alert("🎉 Code Accepted! You are now a Pro user.");
    } else {
      alert("❌ Invalid Code.");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={{position:'absolute', top:20, right:20, fontSize:'12px', textAlign:'right'}}>
        <div style={{marginBottom:'5px', color:'#888'}}>{user.email}</div>
        <div style={{marginBottom:'10px', color: isVIP ? '#ffd700' : '#666', fontWeight:'bold'}}>
          {isVIP ? "👑 PRO ACCOUNT" : "FREE ACCOUNT"}
        </div>
        <button onClick={doLogout} style={{padding:'5px 10px', cursor:'pointer', background:'#333', color:'white', border:'none', borderRadius:'5px'}}>Logout</button>
      </div>

      <h1 style={{fontSize:'50px', margin:'0'}}>💎 Victory Coin</h1>
      <p style={{color:'#888', marginTop:'10px'}}>Dashboard</p>
      
      {!isVIP && (
        <p 
          onClick={handleRedeem} 
          style={{color:'#4fc3f7', cursor:'pointer', textDecoration:'underline', fontSize:'12px', marginTop:'5px'}}
        >
          Have an access code? Redeem here.
        </p>
      )}
      
      <div style={{display:'flex', gap:'20px', marginTop:'40px', flexWrap:'wrap', justifyContent:'center'}}>
        
        {/* MERCHANT POS (Free) */}
        <div style={cardStyle}>
          <h3>☕ Merchant POS</h3>
          <p style={{fontSize:'13px', color:'#aaa'}}>Accept VIC payments.</p>
          <button style={btnStyle} onClick={() => setPage('pos')}>Launch Terminal</button>
        </div>

        {/* TOKEN FACTORY (Locked) */}
        <div style={{...cardStyle, border: isVIP ? '1px solid #333' : '1px solid #444', opacity: isVIP ? 1 : 0.8}}>
          <h3>🏭 Token Factory</h3>
          <p style={{fontSize:'13px', color:'#aaa'}}>Mint new assets.</p>
          
          {isVIP ? (
            <button style={btnStyle} onClick={() => setPage('admin')}>Open Factory</button>
          ) : (
            <button 
              style={{...btnStyle, background:'#ffd700', color:'black'}} 
              onClick={() => window.open(STRIPE_LINK, '_blank')}
            >
              🔒 Upgrade to Use
            </button>
          )}
        </div>

        {/* LIQUIDITY GUIDE (Free) */}
        <div style={cardStyle}>
          <h3>🌊 Add Liquidity</h3>
          <p style={{fontSize:'13px', color:'#aaa'}}>List on SunSwap.</p>
          <button style={btnStyle} onClick={() => setPage('guide')}>Read Guide</button>
        </div>

      </div>
    </div>
  );
};

// 3. MERCHANT POS (Ghost Reader)
const MerchantPOS = ({ setPage }: any) => {
  const [amount, setAmount] = useState("10");
  const [isWaiting, setIsWaiting] = useState(false);
  const [initial, setInitial] = useState(0);
  const [receipt, setReceipt] = useState<any>(null);

  async function checkBalance() {
    try {
      const res = await fetch(`https://nileapi.tronscan.org/api/token_trc20/holders?contract_address=${TOKEN_ADDRESS}&holder_address=${STORE_WALLET}`);
      const data = await res.json();
      if (data.trc20_tokens?.[0]) return parseFloat(data.trc20_tokens[0].balance) / 1e18;
      return 0;
    } catch { return -1; }
  }

  async function start() {
    const bal = await checkBalance();
    if (bal === -1) return alert("Error connecting to Blockchain API.");
    setInitial(bal);
    setIsWaiting(true);
  }

  useEffect(() => {
    let interval: any;
    if (isWaiting) {
      interval = setInterval(async () => {
        const now = await checkBalance();
        if (now > initial + 0.000001) {
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
        <button style={btnStyle} onClick={() => {setReceipt(null);}}>Next Order</button>
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
            <button style={btnStyle} onClick={start}>Generate Bill</button>
          </>
        ) : (
          <>
            <div style={{background:'#fff', padding:'10px', display:'inline-block'}}><QRCodeCanvas value={STORE_WALLET} size={180} /></div>
            <p style={{color:'white', fontWeight:'bold', fontSize:'14px'}}>Scanning for {amount} VIC...</p>
            <button style={{...btnStyle, background:'#ccc', color:'#333'}} onClick={() => setIsWaiting(false)}>Cancel</button>
          </>
        )}
      </div>
      <button style={{...navBtnStyle, marginTop:'20px'}} onClick={() => setPage('home')}>Exit POS</button>
    </div>
  );
};

// 4. ADMIN FACTORY
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
        <input style={inputStyle} placeholder="Name (e.g. Gold)" onChange={e => setForm({...form, name: e.target.value})} />
        <input style={inputStyle} placeholder="Symbol (e.g. GLD)" onChange={e => setForm({...form, symbol: e.target.value})} />
        <input style={inputStyle} type="number" value={form.supply} onChange={e => setForm({...form, supply: parseInt(e.target.value)})} />
        <button style={btnStyle} onClick={createToken}>🚀 Mint Coin</button>
      </div>
      <button style={{...navBtnStyle, marginTop:'20px'}} onClick={() => setPage('home')}>Back Home</button>
    </div>
  );
};

// 5. LIQUIDITY GUIDE
const LiquidityGuide = ({ setPage }: any) => (
  <div style={{...pageStyle, justifyContent: 'flex-start', paddingTop: '50px'}}>
    <div style={{maxWidth:'600px', textAlign:'left', padding:'20px'}}>
      <h1>🌊 How to Add Liquidity</h1>
      <p style={{color:'#ccc'}}>To give Victory Coin a real price, you must add funds to a Liquidity Pool.</p>
      <div style={{background:'#1e1e1e', padding:'25px', borderRadius:'15px', marginTop:'20px', border:'1px solid #333'}}>
        <h3>Step 1: Go to SunSwap</h3>
        <p>Visit <a href="https://sun.io/?lang=en-US#/v2/pool" target="_blank" style={{color:'#4fc3f7'}}>Sun.io V2 Pool</a>.</p>
        <h3>Step 2: Create a Pair</h3>
        <p>Click <strong>"Add Liquidity"</strong>.</p>
        <ul>
          <li>Token 1: <strong>TRX</strong></li>
          <li>Token 2: Paste Address: <br/><code style={{background:'#000', padding:'2px 5px', borderRadius:'3px'}}>{TOKEN_ADDRESS}</code></li>
        </ul>
        <button style={{...btnStyle, marginTop:'10px'}} onClick={() => window.open('https://sun.io/?lang=en-US#/v2/pool', '_blank')}>Open SunSwap Pool</button>
      </div>
      <button style={{...navBtnStyle, marginTop:'20px'}} onClick={() => setPage('home')}>Back to Dashboard</button>
    </div>
  </div>
);

// MASTER CONTROLLER
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [page, setPage] = useState('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <LoginPage />;

  return (
    <>
      {page === 'home' && <LandingPage setPage={setPage} user={session.user} doLogout={() => supabase.auth.signOut()} />}
      {page === 'admin' && <AdminFactory setPage={setPage} />}
      {page === 'pos' && <MerchantPOS setPage={setPage} />}
      {page === 'guide' && <LiquidityGuide setPage={setPage} />}
    </>
  );
}

// STYLES
const pageStyle: any = { minHeight:'100vh', background:'#121212', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px' };
const boxStyle: any = { background:'white', color:'black', padding:'40px', borderRadius:'20px', width:'300px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const cardStyle: any = { background:'#1e1e1e', padding:'20px', borderRadius:'15px', width:'250px', display:'flex', flexDirection:'column', justifyContent:'space-between', border:'1px solid #333' };
const inputStyle: any = { width:'100%', padding:'12px', fontSize:'16px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ccc', boxSizing:'border-box', background:'#f9f9f9' };
const btnStyle: any = { width:'100%', padding:'12px', background:'black', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', fontWeight:'bold', cursor:'pointer' };
const navBtnStyle: any = { padding:'10px 20px', background:'#333', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' };