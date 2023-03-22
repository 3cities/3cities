import { configureChains, disconnect, getAccount } from '@wagmi/core';
import { createClient } from 'wagmi'; // NB createClient exported by wagmi seems to include a built-in queryClient and is a different type than createClient exported by @wagmi/core; this createClient from 'wagmi' is recommended for a react app, to prevent us from having to construct our own queryClient
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { chainsSupportedBy3cities } from './chains';
import { makeWeb3AuthConnectorAsync } from './makeWeb3AuthConnectorAsync';
import { Web3AuthConnector, Web3AuthLoginProvider } from './Web3AuthConnector';

const alchemyApiKey: string = (() => {
  const s = process.env['REACT_APP_ALCHEMY_API_KEY'];
  if (s === undefined) {
    console.warn("REACT_APP_ALCHEMY_API_KEY undefined");
    return 'REACT_APP_ALCHEMY_API_KEY_undefined';
  } else return s;
})();

const infuraApiKey: string = (() => {
  const s = process.env['REACT_APP_INFURA_API_KEY'];
  if (s === undefined) {
    console.warn("REACT_APP_INFURA_API_KEY undefined");
    return 'REACT_APP_INFURA_API_KEY_undefined';
  } else return s;
})();

const { chains, provider, webSocketProvider } = configureChains(
  chainsSupportedBy3cities,
  [
    alchemyProvider({ apiKey: alchemyApiKey, priority: 1, stallTimeout: 1000 /* millis */ }),
    infuraProvider({ apiKey: infuraApiKey, priority: 10, stallTimeout: 1000 /* millis */ }),
    publicProvider({ priority: 100, stallTimeout: 1000 /* millis */ }), // publicProvider automatically creates fallback providers for all supported networks using each network's chain.rpcUrls.default, including for networks that are unsupported by alchemy and infura. For example, zkSyncTestnet is currently unsupported by alchemy and infura and only gets connectivity from publicProvider
  ],
);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    // NB connectkit doesn't auto-detect Web3Auth connectors and doesn't display an option for Web3Auth, and so logging in with web3auth is not currently possible in connectkit's modal https://github.com/family/connectkit/tree/main/packages/connectkit/src/wallets/connectors --> instead, we implement lazy loading of a Web3AuthConnector below and this connector is expected to be activated outside of connectkit (eg. in our component built to activate it)
    // new WalletConnectConnector({ // --> I have temporarily disabled WalletConnect because, at least with connectkit, the UX is messed up. It pops up two stacked windows, one is missing a QR code, the other seems like a full web3modal. --> I just want to be able to precisely control where the QR code is rendered, and the copy wc link to clipboard. How can I do that?
    //   chains,
    //   options: {
    //     projectId: "a85a7f7f5074fd8ffe48a9805ed740f9", // TODO this is our test projectId. --> make into env var and make a production projectId (NB projectId can't be provided here when using walletconnect v1; it's needed here for v2)        
    //     showQrModal: true,
    //     metadata: {
    //       name: '3cities',
    //       description: '',
    //       url: 'TODO',
    //       icons: ['TODO'],
    //     }
    //   },
    // }),
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true, // here we pass true for both shimDisconnect and shimChainChangedDisconnect so that wagmi patches ergonomic holes in metamask (and possibly some injected wallets), or else the user may experience ergonomically poor UX, including (i) user diconnects their wallet from inside the wallet browser extension, but this disconnect doesn't register with the app, so the app remains 'connected' when in fact it's disconnected, and (ii) user switches the chain from inside the wallet browser extension, and this chain switch causes the wallet to disconnect from the app --> NB these shims are imperfect and the user's wallet will still sometimes disconnect when the user switches chains from inside the wallet https://github.com/MetaMask/metamask-extension/issues/13375 https://github.com/wagmi-dev/wagmi/issues/563
        shimChainChangedDisconnect: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "3cities",
        chainId: chainsSupportedBy3cities[0].id, // this chainId is used by CoinbaseWalletSDK as some kind of fallback chainId. Here we pass the first chainId from our supported chains to ensure that whatever fallback is used in CoinbaseWalletSDK, it's actually one of our supported chains (and especially to avoid falling back to the default of mainnet when not in production)
      },
    }),
    new InjectedConnector({ // NB connectkit's wallet connection modal will only show InjectedConnector in the list of available wallets if there's actually a non-metamask, non-coinbase browser wallet extension, see shouldShowInjectedConnector https://github.com/family/connectkit/blob/8ac82c816c76df9154c37347c0721219d2b88a14/packages/connectkit/src/components/Pages/Connectors/index.tsx#L115 --> I was able to get Backpack.app wallet working --> connectkit detects this InjectedConnector in the wagmi.Client and also detects the Backpack browser extension, and then surfaces the wallet option "Browser Wallet" (NB phantom doesn't show up as an InjectedConnector/Browser Wallet, nor does it show up as a fake MetaMask wallet, it simply doesn't show up)
      chains,
      options: {
        shimDisconnect: true, // here we pass true for both shimDisconnect and shimChainChangedDisconnect so that wagmi patches ergonomic holes in metamask (and possibly some injected wallets), or else the user may experience ergonomically poor UX, including (i) user diconnects their wallet from inside the wallet browser extension, but this disconnect doesn't register with the app, so the app remains 'connected' when in fact it's disconnected, and (ii) user switches the chain from inside the wallet browser extension, and this chain switch causes the wallet to disconnect from the app --> NB these shims are imperfect and the user's wallet will still sometimes disconnect when the user switches chains from inside the wallet https://github.com/MetaMask/metamask-extension/issues/13375 https://github.com/wagmi-dev/wagmi/issues/563
        shimChainChangedDisconnect: true,
        name: (detectedName: string | string[]) =>
          `Injected (${typeof detectedName === 'string'
            ? detectedName
            : detectedName.join(', ')
          })`,
      },
    }),
  ],
});

let web3AuthConnector: Web3AuthConnector | undefined = undefined;

// ensureWeb3AuthConnectorDestroyed ensures that any extant
// Web3AuthConnector has been disconnected and destroyed.
// postcondition: web3AuthConnector undefined and wagmiClient has no Web3AuthConnector
async function ensureWeb3AuthConnectorDestroyed(): Promise<void> {
  if (web3AuthConnector !== undefined) {
    // there's an extant Web3AuthConnector. We'll disconnect it if it's active and then destroy it
    const { connector: activeConnector } = getAccount();
    if (activeConnector && web3AuthConnector.connector.id === activeConnector.id) {
      // the extant Web3AuthConnector is active, we'll disconnect it and then destroy it
      // console.log("ensureWeb3AuthConnectorDestroyed: disconnecting active Web3AuthConnector", activeConnector);
      await disconnect();
    }
    // console.log("ensureWeb3AuthConnectorDestroyed: destroying extant Web3AuthConnector", activeConnector);
    // destroy the extant Web3AuthConnector by removing it from wagmiClient. TODO what's the recommended way to destroy a connector? https://github.com/wagmi-dev/wagmi/discussions/1822#discussioncomment-4960134
    wagmiClient.setState(s => {
      return Object.assign({}, s, {
        connectors: s.connectors.filter(c => !web3AuthConnector || c.id !== web3AuthConnector.connector.id),
      });
    });
    web3AuthConnector = undefined;
  }
}

let isLoadingMakeAndSetWeb3AuthConnector: boolean = false; // condition variable for makeAndSetWeb3AuthConnector

// makeAndSetWeb3AuthConnector constructs our singleton
// Web3AuthConnector using the passed Web3AuthLoginProvider and sets
// this newly constructed connector in our singleton wagmiClient. But
// before this construction, we'll destroy any previously-existing
// Web3AuthConnector and disconnect the user's wallet if a
// previously-existing Web3AuthConnector is the active connector.
export async function makeAndSetWeb3AuthConnector(web3AuthLoginProvider: Web3AuthLoginProvider): Promise<Web3AuthConnector> {
  if (isLoadingMakeAndSetWeb3AuthConnector) throw new Error(`unsupported call to makeAndSetWeb3AuthConnector while another invocation of makeAndSetWeb3AuthConnector was still loading`);
  isLoadingMakeAndSetWeb3AuthConnector = true;

  // 1. Destroy any extant Web3AuthConnector because wagmiClient doesn't support duplicate connectors with the same connector.id, and all Web3Auth connectors have the same id regardless of with which Web3AuthLoginProvider they are configured
  await ensureWeb3AuthConnectorDestroyed().catch(err => {
    const e = new Error(`makeAndSetWeb3AuthConnector: ensureWeb3AuthConnectorDestroyed failed: ${err}`);
    console.error(e, 'underlying error:', err);
    isLoadingMakeAndSetWeb3AuthConnector = false; // ensure isLoadingMakeAndSetWeb3AuthConnector is set to false to clear the loading state so that makeAndSetWeb3AuthConnector may be retried
    throw e; // here we must re-throw so that any clients depending on this promise receive the rejection or else, from these clients' point of view, the promise will fail silently
  });
  // console.log("connectors after ensureWeb3AuthConnectorDestroyed", wagmiClient.connectors);

  // 2. Construct our new singleton Web3AuthConnector and add it to our singleton wagmiClient
  const newConnector: Web3AuthConnector = await makeWeb3AuthConnectorAsync(chainsSupportedBy3cities, web3AuthLoginProvider).catch(err => {
    const e = new Error(`makeAndSetWeb3AuthConnector: makeWeb3AuthConnectorAsync failed: ${err}`);
    console.error(e, 'underlying error:', err);
    isLoadingMakeAndSetWeb3AuthConnector = false; // ensure isLoadingMakeAndSetWeb3AuthConnector is set to false to clear the loading state so that makeAndSetWeb3AuthConnector may be retried
    throw e; // here we must re-throw so that any clients depending on this promise receive the rejection or else, from these clients' point of view, the promise will fail silently
  });
  wagmiClient.setState(s => {
    return Object.assign({}, s, {
      connectors: [...s.connectors, newConnector.connector],
    });
  });

  web3AuthConnector = newConnector;
  // console.log("connectors after creating web3Auth", wagmiClient.connectors);
  isLoadingMakeAndSetWeb3AuthConnector = false;
  return web3AuthConnector;
}

// console.log("wagmiClient.chains", wagmiClient.chains); // WARNING wagmiClient.chains seems to be defined if and only if the wallet is currently connected. For that reason, we shouldn't rely on wagmiClient.chains to power any downstream config (eg. Web3Modal EthereumClient's chains) https://github.com/wagmi-dev/wagmi/discussions/1832