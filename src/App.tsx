import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [qrValue, setQrValue] = useState('')
  const [value, setValue] = useState('')
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [chainId, setChainId] = useState('')
  const [activeTab, setActiveTab] = useState('examples') // State to manage active tab
  const [qrSize, setQrSize] = useState(256) // State for QR code size


  /*
  Params:
    - fromToken CAIP19 format (optional)
    - toToken CAIP19 format (optional)
    - amount (optional)
    - decimals (optional - default 18 in code) [ignore for now]
    - chainId (optional)
  */

  // Add token addresses as constants
  const TOKEN_ADDRESSES = {
    USDC_MAINNET: 'eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT_MAINNET: 'eip155:1/erc20:0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC_LINEA: 'eip155:59144/erc20:0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    USDT_LINEA: 'eip155:59144/erc20:0xA219439258ca9da29E9Cc4cE5596924745e12B93'
  }

  // Adjust QR code size based on screen width
  useEffect(() => {
    const handleResize = () => {
      // For mobile screens, make QR code smaller
      if (window.innerWidth < 600) {
        setQrSize(200)
      } else {
        setQrSize(256)
      }
    }

    handleResize() // Set initial size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const baseLink = 'https://metamask.app.link/swap'

  const tokens = ['ETH', 'DAI', 'USDC', 'USDT'];
  const chains = ['1', '56', '137', '59144']; // Chain IDs for Ethereum, BNB, Polygon, Linea

  const updateLink = (newValues: {
    value?: string,
    fromToken?: string,
    toToken?: string,
    chainId?: string
  } = {}) => {
    const params = new URLSearchParams();
    
    const currentValue = newValues.value !== undefined ? newValues.value : value;
    const currentFromToken = newValues.fromToken !== undefined ? newValues.fromToken : fromToken;
    const currentToToken = newValues.toToken !== undefined ? newValues.toToken : toToken;
    const currentChainId = newValues.chainId !== undefined ? newValues.chainId : chainId;
    
    if (currentValue.trim()) params.append('value', currentValue);
    if (currentFromToken.trim()) params.append('fromToken', encodeURIComponent(currentFromToken));
    if (currentToToken.trim()) params.append('toToken', encodeURIComponent(currentToToken));
    if (currentChainId.trim()) params.append('chainId', currentChainId);

    const newLink = `${baseLink}?${params.toString()}`;
    setText(newLink);
    setQrValue(newLink); // Update QR code immediately with the new link
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setText(''); // Reset link when switching tabs
    setQrValue(''); // Reset QR code when switching tabs
    setValue('');
    setFromToken('');
    setToToken('');
    setChainId('');
  }

  const handleSelectUrl = (url: string) => {
    setText(url);
    setQrValue(url); // Update QR code immediately when selecting a URL
  }

  // Function to parse URL and extract parameters for the bullet points
  const getUrlParams = (url: string) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      const paramEntries = Array.from(params.entries());
      
      return paramEntries.length > 0 ? (
        <ul className="param-list">
          <li><strong>Base URL:</strong> {urlObj.origin + urlObj.pathname}</li>
          {paramEntries.map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      ) : (
        <p>No parameters in URL</p>
      );
    } catch {
      // Fix linter error by removing the unused variable
      return <p>Invalid URL</p>;
    }
  };

  return (
    <div className="container">
      <h1 className="app-title">Swap Deeplinks</h1>
      <div className="content">
        <div className="left-panel">
          <div className="tabs">
            <div className={`tab ${activeTab === 'examples' ? 'active' : ''}`} onClick={() => handleTabChange('examples')}>Examples</div>
            <div className={`tab ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => handleTabChange('custom')}>Custom</div>
          </div>
          {activeTab === 'examples' && (
            <div className="examples-container">
              <h2>Example Links</h2>
              <ul className="example-list">
                <li className="url-item">
                  <span>Swap 1 USDC to USDT</span>
                  <button onClick={() => handleSelectUrl(`${baseLink}?fromToken=${encodeURIComponent(TOKEN_ADDRESSES.USDC_MAINNET)}&toToken=${encodeURIComponent(TOKEN_ADDRESSES.USDT_MAINNET)}&value=1`)} className="plus-button">➕</button>
                </li>
                <li className="url-item">
                  <span>Swap 1 USDC to USDT on Linea</span>
                  <button onClick={() => handleSelectUrl(`${baseLink}?fromToken=${encodeURIComponent(TOKEN_ADDRESSES.USDC_LINEA)}&toToken=${encodeURIComponent(TOKEN_ADDRESSES.USDT_LINEA)}&value=1&chainId=59144`)} className="plus-button">➕</button>
                </li>
                <li className="url-item">
                  <span>Swap 1 USDT to USDC on Mainnet</span>
                  <button onClick={() => handleSelectUrl(`${baseLink}?fromToken=${encodeURIComponent(TOKEN_ADDRESSES.USDT_MAINNET)}&toToken=${encodeURIComponent(TOKEN_ADDRESSES.USDC_MAINNET)}&value=1&chainId=1`)} className="plus-button">➕</button>
                </li>
                <li className="url-item">
                  <span>Swap USDC</span>
                  <button onClick={() => handleSelectUrl(`${baseLink}?fromToken=${encodeURIComponent(TOKEN_ADDRESSES.USDC_MAINNET)}`)} className="plus-button">➕</button>
                </li>
                <li className="url-item">
                  <span>Swap 1 USDT</span>
                  <button onClick={() => handleSelectUrl(`${baseLink}?fromToken=${encodeURIComponent(TOKEN_ADDRESSES.USDT_MAINNET)}&value=1`)} className="plus-button">➕</button>
                </li>
              </ul>
            </div>
          )}
          {activeTab === 'custom' && (
            <div className="dropdowns">
              <h2>Custom Parameters</h2>
              <div className="custom-link-input">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setQrValue(e.target.value);
                  }}
                  placeholder="Paste your custom link here"
                />
              </div>
              <hr style={{ opacity: '0.5', marginTop: '50px', marginBottom: '50px' }} />
              
              <h2 className="custom-subtitle">Create Your Own</h2>

              <div className="dropdown-group">
                <input
                  type="text"
                  value={fromToken}
                  onChange={(e) => {
                    const newFromToken = e.target.value;
                    setFromToken(newFromToken);
                    updateLink({ fromToken: newFromToken });
                  }}
                  placeholder="From Token Address (optional)"
                  list="tokensList"
                />
                <datalist id="tokensList">
                  {tokens.map((token) => (
                    <option key={token} value={token} />
                  ))}
                </datalist>
                
                
                <input
                  type="text"
                  value={toToken}
                  onChange={(e) => {
                    const newToToken = e.target.value;
                    setToToken(newToToken);
                    updateLink({ toToken: newToToken });
                  }}
                  placeholder="To Token Address (optional)"
                  list="tokensList"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setValue(newValue);
                    updateLink({ value: newValue });
                  }}
                  placeholder="Value (optional)"
                />
                <input
                  type="text"
                  value={chainId}
                  onChange={(e) => {
                    const newChainId = e.target.value;
                    setChainId(newChainId);
                    updateLink({ chainId: newChainId });
                  }}
                  placeholder="Chain ID (optional)"
                  list="chainsList"
                />
                <datalist id="chainsList">
                  {chains.map((chain) => (
                    <option key={chain} value={chain} />
                  ))}
                </datalist>
              </div>
            </div>
          )}
        </div>
        <div className="divider" />
        <div className="right-panel">
          <h2>QR Code Generator</h2>
          <div className="input-group">
            <input
              type="text"
              value={text}
              onChange={(e) => { 
                setText(e.target.value); 
                setQrValue(e.target.value); 
              }}
              placeholder="Generated link will appear here"
            />
          </div>
          <div className="link-description">
            <strong>Current Link: </strong>
            {text ? (
              <a href={text} target="_blank" rel="noopener noreferrer" className="generated-link">
                {text}
              </a>
            ) : (
              <span>No link generated yet</span>
            )}
          </div>
          {qrValue && (
            <div className="qr-container">
              <QRCodeSVG value={qrValue} size={qrSize} />
            </div>
          )}
          <div className="qr-description">
            <strong>Link Parameters:</strong>
            {qrValue ? getUrlParams(qrValue) : <p>No parameters available</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
