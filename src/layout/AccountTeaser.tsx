import React, {useState, useContext} from 'react';
import {StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Identicon from '@polkadot/reactnative-identicon';
import {
  Layout,
  Text,
  Icon,
  Tooltip,
  Modal,
  Card,
  Button,
} from '@ui-kitten/components';
import globalStyles, {
  monofontFamily,
  getIconColorByTheme,
  standardPadding,
} from 'src/styles';
import {ThemeContext} from 'context/ThemeProvider';
import QRCode from '../presentational/QRCode';
import Padder from '../presentational/Padder';
import AccountInfoInlineTeaser from '../presentational/AccountInfoInlineTeaser';
import {AccountContext} from 'context/AccountContextProvider';
import {NetworkContext} from 'context/NetworkContext';
import {ChainApiContext} from 'context/ChainApiContext';
import useAccountDetail from 'src/hook/useAccountDetail';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

type PropTypes = {
  level: '1' | '2';
  address: string;
};

function AccountTeaser(props: PropTypes) {
  const navigation = useNavigation();
  const {address} = props;
  const [copyTooltipVisible, setCopyTooltipVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const {theme} = useContext(ThemeContext);
  const {accounts} = useContext(AccountContext);
  const {currentNetwork} = useContext(NetworkContext);
  const {api} = useContext(ChainApiContext);
  const account = accounts?.[0];
  const {display, detail} = useAccountDetail(
    currentNetwork?.key || 'polkadot',
    account?.address,
    api,
  );

  const handleIconPressed = (addr?: string) => {
    if (addr) {
      navigation.navigate('MyIdentity', {address: addr});
    }
  };

  const renderCopyIcon = () => (
    <TouchableOpacity
      onPress={() => {
        setCopyTooltipVisible(true);
        Clipboard.setString(address);
        setTimeout(() => setCopyTooltipVisible(false), 2500);
      }}>
      <Icon
        style={[styles.icon, {color: getIconColorByTheme(theme)}]}
        pack="ionic"
        name="copy-outline"
      />
    </TouchableOpacity>
  );

  return (
    <Layout
      level={props.level}
      style={[globalStyles.paddedContainer, styles.container]}>
      <TouchableOpacity onPress={() => handleIconPressed(account?.address)}>
        <Identicon value={address} size={60} />
      </TouchableOpacity>
      {display ? (
        <AccountInfoInlineTeaser
          display={display}
          judgements={detail?.data?.judgements}
        />
      ) : null}
      <Layout level={props.level} style={styles.addressContainer}>
        <TouchableOpacity onPress={() => setQrVisible(true)}>
          <Icon
            style={[styles.icon, {color: getIconColorByTheme(theme)}]}
            pack="ionic"
            name="qr-code-sharp"
          />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          selectable
          ellipsizeMode="middle"
          style={[styles.address, {fontFamily: monofontFamily}]}>
          {address}
        </Text>
        <Tooltip
          placement="top"
          anchor={renderCopyIcon}
          visible={copyTooltipVisible}
          onBackdropPress={() => setCopyTooltipVisible(false)}>
          Copied!
        </Tooltip>
        <Modal
          visible={qrVisible}
          backdropStyle={globalStyles.backdrop}
          style={{width: width * 0.8}}
          onBackdropPress={() => setQrVisible(false)}>
          <Card style={styles.qrContainer} disabled={true}>
            <Text style={[styles.qrAddressText, {fontFamily: monofontFamily}]}>
              {address}
            </Text>
            <QRCode data={address} dimention={width * 0.6} />
            <Padder scale={1} />
            <Button appearance="outline" onPress={() => setQrVisible(false)}>
              DISMISS
            </Button>
          </Card>
        </Modal>
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: height * 0.2,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  address: {
    width: 150,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  qrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrAddressText: {
    padding: standardPadding,
  },
});

export default AccountTeaser;
