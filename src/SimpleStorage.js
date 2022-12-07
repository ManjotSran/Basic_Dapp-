import { ethers } from 'ethers';
import React, {useState} from 'react'
import SimpleStorage_abi from './contracts/SimpleStorage_abi.json'


const SimpleStorage = () => {

    let contractAddress = '0xB5F9999Ff2F4AAAA08Cc2Ae017553c37E060FE1D';

    const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);


    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
                setConnButtonText('Wallet Connected');
            })

        } else {
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }

    const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
        updateEthers();
		
	}

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, SimpleStorage_abi, tempSigner);
		setContract(tempContract);	

    }


    const setHandler = (event) => {
		event.preventDefault();
		contract.set(event.target.setText.value);
	}

    const getCurrentVal = async () => {
		let val = await contract.get();
		setCurrentContractVal(val);
	}


    return (
        <div>
            <h3> {"Get/Set Contract interaction"} </h3>
			<button onClick={connectWalletHandler}>{connButtonText}</button>

            <div>
				<h3>Address: {defaultAccount}</h3>
			</div>

            <form onSubmit={setHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> Update Contract </button>
			</form>

            <div>
			<button onClick={getCurrentVal} style={{marginTop: '1em'}}> Get Current Contract Value </button>
            </div>
			
            {currentContractVal}
			
        </div>
    )
        
        
       
    
}
export default SimpleStorage;