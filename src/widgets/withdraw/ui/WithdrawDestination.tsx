import { Alert } from 'shared/ui/alert';
import { cn, formatAddress, isTonAddress } from 'shared/utils';

import type { WithdrawDestination } from '../model/types';

import styles from './withdraw.module.css';

interface Props {
  destination: WithdrawDestination;
  connectedAddress?: string;
  customAddress: string;
  onDestinationChange: (value: WithdrawDestination) => void;
  onCustomAddressChange: (value: string) => void;
  onConnectWallet: () => void;
}

export const WithdrawDestination = ({
  destination,
  connectedAddress,
  customAddress,
  onDestinationChange,
  onCustomAddressChange,
  onConnectWallet,
}: Props) => {
  const addressTouched = customAddress.trim().length > 0;
  const isAddressValid = isTonAddress(customAddress);

  return (
    <div className={styles.field}>
      <label className={styles.label}>Destination</label>
      <div className={styles.tabs} role="tablist" aria-label="Destination">
        <button
          type="button"
          role="tab"
          aria-selected={destination === 'wallet'}
          className={cn(
            styles.tab,
            destination === 'wallet' && styles.tabActive
          )}
          onClick={() => onDestinationChange('wallet')}
        >
          My wallet
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={destination === 'address'}
          className={cn(
            styles.tab,
            destination === 'address' && styles.tabActive
          )}
          onClick={() => onDestinationChange('address')}
        >
          Address
        </button>
      </div>

      {destination === 'wallet' ? (
        connectedAddress ? (
          <div className={styles.walletCard}>
            <span className={styles.walletLabel}>Withdraw to</span>
            <span className={styles.walletAddress} title={connectedAddress}>
              {formatAddress(connectedAddress, 6)}
            </span>
          </div>
        ) : (
          <div className={styles.connectBlock}>
            <p className={styles.connectText}>
              Connect a wallet to withdraw in one tap
            </p>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onConnectWallet}
            >
              Connect wallet
            </button>
          </div>
        )
      ) : (
        <div className={styles.addressSection}>
          <div className={styles.warningWrap}>
            <Alert variant="warning" title="Double-check the TON address">
              Withdrawals are irreversible. Send only to a TON address — a wrong
              network or typo means permanent loss of funds.
            </Alert>
          </div>

          <div
            className={cn(
              styles.addressBox,
              addressTouched && !isAddressValid && styles.fieldInvalid
            )}
          >
            <input
              className={styles.addressInput}
              value={customAddress}
              onChange={e => onCustomAddressChange(e.target.value)}
              placeholder="UQ..."
              spellCheck={false}
              autoComplete="off"
              aria-label="TON address"
            />
          </div>

          {addressTouched && !isAddressValid && (
            <p className={styles.fieldError}>Enter a valid TON address</p>
          )}
        </div>
      )}
    </div>
  );
};
