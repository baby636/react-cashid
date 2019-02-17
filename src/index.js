import React from 'react';
import CashID from 'cashid';
import styled from 'styled-components';
import { QRCode } from 'react-qr-svg';

class CashId extends React.Component {
  constructor(props) {
    super(props);
    this.state = { web4bch: null, cashIDuri: '', badger: true };
  }
  componentDidMount() {
    if (typeof window.web4bch === 'undefined') {
      window.open('https://badger.bitcoin.com/', '_blank').focus();
      this.setState({
        badger: false
      });
    } else {
      let web4bch = new window.Web4Bch(window.web4bch.currentProvider);
      if (!web4bch.bch.defaultAccount) {
        alert('please unlock your badgerwallet');
      }

      let uri = this.generateURI();

      this.setState({
        cashIDuri: uri,
        web4bch: web4bch
      });
    }
  }

  generateURI() {
    let { domain, path, action, data, metadata } = this.props;
    let cashid = new CashID(domain, path);
    let uri = cashid.createRequest(action, data, metadata);
    return uri;
  }

  badgerSign(cashIDRequest) {
    let web4bch = this.state.web4bch;
    if (typeof window.web4bch === undefined) {
      window.open('https://badgerwallet.cash/#/install');
    } else {
      web4bch.bch.sign(web4bch.bch.defaultAccount, cashIDRequest, function(
        err,
        res
      ) {
        console.log('res', res);
        console.log('err', err);

        if (err) return;
      });
    }
  }
  render() {
    let { badger, cashIDuri } = this.state;
    return (
      <div>
        {badger ? (
          <CashIDdiv>
            <div
              className={`${this.props.color} badgerButton`}
              onClick={() => {
                this.badgerSign(cashIDuri);
              }}
            >
              Login with badger
            </div>

            <br />
            <br />
            <div>
              or scan with CashID manager
              <br />
              <br />
              {cashIDuri && <QRCode value={cashIDuri} style={{ width: 200 }} />}
            </div>
          </CashIDdiv>
        ) : (
          <div>
            you must have{' '}
            <a
              href='https://badgerwallet.cash/#/install'
              rel='nofollow'
              target='_blank'
            >
              {' '}
              Badger Wallet{' '}
            </a>{' '}
            installed to login with CashID
          </div>
        )}
      </div>
    );
  }
}
const CashIDdiv = styled.div`
  display: block;
  .badgerButton {
    cursor: pointer;
    display: inline-block;
    min-height: 1rem;
    outline: 0;
    border: none;
    border-radius: 5px;
    vertical-align: baseline;
    background: #e0e1e2 none;
    color: rgba(0, 0, 0, 0.6);
    font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    margin: 0 0.25rem 0 0;
    padding: 0.75rem 1.5rem 0.75rem;
    color: #ffffff;
    &.red {
      background: #dc3545;
    }
    &.blue {
      background: #0062cc;
    }
    &.orange {
      background: #f59332;
    }
    &.grey {
      background: #4d4d4d;
    }
    &.green {
      background: #28a745;
    }
    &:hover {
      opacity: 0.8;
    }
  }
`;
export default CashId;
