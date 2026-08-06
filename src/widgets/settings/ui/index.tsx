import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { RefreshCw } from 'lucide-react';

import { Dialog } from 'shared/ui/dialog';
import { cn } from 'shared/utils';

import { formatAddress } from '../utils';

import { Setting } from './setting';
import styles from './settings-dialog.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: Props) => {
  const walletAddess = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const handleSwitchWallet = async () => {
    if (!walletAddess) {
      await tonConnectUI.openModal();
      return;
    }

    await tonConnectUI.disconnect();
    await tonConnectUI.openModal();
  };

  return (
    <Dialog open={open} title="Settings" onClose={onClose}>
      <Setting label="Web3 Address">
        {walletAddess ? (
          <div className={styles.walletRow}>
            <span
              className={cn(styles.userName, styles.walletAddress)}
              title={walletAddess}
            >
              {formatAddress(walletAddess)}
            </span>

            <button
              type="button"
              className={styles.walletBtn}
              onClick={() => void handleSwitchWallet()}
              aria-label="Сменить кошелёк"
              title="Сменить кошелёк"
            >
              <p>CHANGE</p> <RefreshCw size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            style={{ padding: '1rem' }}
            className={styles.walletBtn}
            onClick={() => void tonConnectUI.openModal()}
          >
            Подключить кошелёк
          </button>
        )}
      </Setting>
    </Dialog>
  );
};
