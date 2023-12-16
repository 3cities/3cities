import { isAddress } from "@ethersproject/address";
import React from "react";
import { Link } from "react-router-dom";
import { mightBeAnEnsName } from "./mightBeAnEnsName";
import { useInput } from "./useInput";

const useInputOpts = {
  onEnterKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => e.currentTarget.blur(),
}

const useInputHtmlAttrs = {
  id: 'address-or-ens',
  className: 'w-full rounded-md border p-3.5',
  type: 'text',
  placeholder: 'Address or ENS',
  autoComplete: "off",
  spellCheck: false,
};

export const Home: React.FC = () => {
  const [addressOrEns, addressOrEnsInput] = useInput('', useInputHtmlAttrs, useInputOpts);

  return <div className="mt-24 text-left max-w-2xl mx-auto">
    <h1 className="text-center text-3xl mb-4">Decentralized Payments for Ethereum</h1>
    <div className="flex flex-col gap-24 justify-center items-center mt-24">
      <div className="w-72 flex flex-col gap-2 justify-start items-left">
        <span className="font-semibold text-lg">Tip or Pay any address</span>
        <div className="w-full flex gap-2 justify-center items-center">
          <div className="flex flex-grow items-center">
            {addressOrEnsInput}
          </div>
          <Link to={`/${addressOrEns}`}>
            <button
              disabled={!addressOrEns || (!isAddress(addressOrEns) && !mightBeAnEnsName(addressOrEns))}
              type="button"
              className="focus:outline-none rounded-md p-3.5 font-medium bg-primary sm:hover:bg-primary-darker active:scale-95 text-white"
            >
              Go
            </button>
          </Link>
        </div>
      </div>
      <div className="w-72 flex flex-col gap-2 justify-start items-left">
        <span className="font-semibold text-lg">Build a custom Pay Request Link</span>
        <Link to="/pay-link" className="w-full">
          <button
            type="button"
            className="w-full focus:outline-none rounded-md p-3.5 font-medium bg-primary sm:hover:bg-primary-darker active:scale-95 text-white"
          >
            Build Link
          </button>
        </Link>
      </div>
    </div>
    <div className="flex flex-col gap-4 justify-center items-center mt-24">
      <h2 className="text-center text-3xl">Partners</h2>
      <a href="https://bluechip.org/" target="_blank" rel="noreferrer" className="sm:hover:cursor-pointer w-72"><img src="/bluechip-wordmark.png" alt="Bluechip" /></a>
    </div>
  </div>;
};
