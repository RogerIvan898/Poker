import { useState } from 'react';

import { beginCell, toNano } from '@ton/core';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Loader2, Wallet } from 'lucide-react';

interface Props {
  amount: number;
  depositAddress: string;
  memo?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  className?: string;
}

export const PayViaWalletButton = ({
  amount,
  depositAddress,
  memo,
  onSuccess,
  onError,
  className,
}: Props) => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!wallet) {
      await tonConnectUI.openModal();
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    if (!depositAddress.trim()) {
      alert('Deposit address is missing');
      return;
    }

    setIsLoading(true);

    try {
      let payload: string | undefined;

      if (memo) {
        payload = beginCell()
          .storeUint(0, 32)
          .storeStringTail(memo)
          .endCell()
          .toBoc()
          .toString('base64');
      }

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60 * 10,
        messages: [
          {
            address: depositAddress,
            amount: toNano(amount.toString()).toString(),
            payload,
          },
        ],
      });

      onSuccess?.();
    } catch (error) {
      console.error('TON Connect transaction error:', error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const label = wallet
    ? isLoading
      ? 'Confirm in Wallet...'
      : `Pay ${amount} TON with Wallet`
    : 'Connect Wallet to Pay';

  return (
    <button
      type="button"
      className={className}
      onClick={() => void handleClick()}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 size={20} /> : <Wallet size={20} />}
      {label}
    </button>
  );
};
