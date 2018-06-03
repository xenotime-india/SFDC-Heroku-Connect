import React from 'react';
import { Icon } from 'react-lightning-design-system';
import { debounce } from 'lodash';

import AccountForm from './../components/AccountForm';
import { DataTable } from './../components/DataTable/DataTable';
import SuccessMessage from './../components/SuccessMessage';
import ErrorMessage from './../components/ErrorMessage';
import { REACT_APP_API_URL } from './../constants';

export default class Root extends React.Component {
  state = {
    isSuccessMessage: false,
    isErrorMessage: false,
    isLoading: false,
    errorMsg: '',
    successMsg: '',
    data: [],
    pages: -1,
    showAccountModal: false,
    dataLoading: false,
    account: {
      name: '',
      webSite: '',
      city: '',
      country: '',
      description: '',
      sfid: null
    }
  };

  alertClose = () => {
    this.setState({
      isSuccessMessage: false,
      isErrorMessage: false
    });
  };

  onFormSubmitSuccess = async paylod => {
    this.setState({
      showAccountModal: false
    });
    const response = await this.upsertAccount(paylod);
    if (response && response.message) {
      this.setState({
        isLoading: false,
        account: {
          name: '',
          webSite: '',
          city: '',
          country: '',
          description: ''
        },
        isSuccessMessage: true,
        successMsg: response.message
      });
    } else
      this.setState({
        isLoading: false,
        isErrorMessage: true,
        isSuccessMessage: false,
        errorMsg: 'An error occurred. Please try again later'
      });
  };

  onFormSubmitFail = errorMsg => {
    this.setState({ isErrorMessage: true, isSuccessMessage: false, errorMsg });
  };

  fetchAccount = async (state, instance) => {
    this.setState({
      dataLoading: true,
      isErrorMessage: false,
      isSuccessMessage: false
    });
    const { pageSize, page, sorted, filtered } = state;
    const [sortby] = sorted;
    const url = `${REACT_APP_API_URL.URL}/api/account/fetch`;
    const paylod = {
      pageSize,
      page: page + 1,
      sortby,
      filtered
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paylod)
    };
    const result = await fetch(url, options);
    const { data, pagination } = await result.json();
    this.setState({
      data,
      pages: pagination.lastPage,
      dataLoading: false
    });
  };

  upsertAccount = async paylod => {
    this.setState({
      isLoading: true,
      isErrorMessage: false,
      isSuccessMessage: false
    });
    const url = `${REACT_APP_API_URL.URL}/api/account/upsert`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paylod)
    };
    const result = await fetch(url, options);
    return result.ok ? await result.json() : null;
  };

  deleteAccount = async accountId => {
    this.setState({
      isLoading: true,
      isErrorMessage: false,
      isSuccessMessage: false
    });
    const url = `${REACT_APP_API_URL.URL}/api/account/delete?sfid=${accountId}`;
    const options = {
      method: 'DELETE'
    };
    const result = await fetch(url, options);
    return result.ok ? await result.json() : null;
  };

  openNewAccountModal = () => {
    this.setState({ showAccountModal: true });
  };

  closeAction = () => {
    this.setState({ showAccountModal: false });
  };

  editAccountAction = row => () => {
    const account = {
      name: row.name,
      webSite: row.website ? row.website : '',
      city: row.billingcity ? row.billingcity : '',
      country: row.billingcountry ? row.billingcountry : '',
      description: row.description ? row.description : '',
      sfid: row.sfid
    };
    this.setState({
      account,
      showAccountModal: true
    });
  };

  deleteAccountAction = sfid => async () => {
    this.setState({
      isLoading: true,
      isErrorMessage: false,
      isSuccessMessage: false
    });
    const response = await this.deleteAccount(sfid);
    if (response && response.message) {
      this.setState({
        isLoading: false,
        isSuccessMessage: true,
        successMsg: response.message
      });
    } else
      this.setState({
        isLoading: false,
        isErrorMessage: true,
        isSuccessMessage: false,
        errorMsg: 'An error occurred. Please try again later'
      });
  };

  render() {
    const {
      data,
      dataLoading,
      showAccountModal,
      isSuccessMessage,
      successMsg,
      isErrorMessage,
      errorMsg,
      account,
      pages
    } = this.state;
    return (
      <article className="slds-card">
        {isSuccessMessage && (
          <SuccessMessage message={successMsg} onClose={this.alertClose} />
        )}
        {isErrorMessage && (
          <ErrorMessage errorMsg={errorMsg} onClose={this.alertClose} />
        )}
        <div className="slds-card__header slds-grid">
          <header className="slds-media slds-media_center slds-has-flexi-truncate">
            <div className="slds-media__figure">
              <span
                className="slds-icon_container slds-icon-standard-contact"
                title="description of icon when needed"
              />
            </div>
            <div className="slds-media__body">
              <span className="slds-text-title_caps">
                <Icon icon="standard:account" /> Accounts
              </span>
            </div>
          </header>
          <div className="slds-no-flex">
            <button
              className="slds-button slds-button_neutral"
              onClick={this.openNewAccountModal}
            >
              New Account
            </button>
          </div>
        </div>
        <div className="slds-card__body">
          <DataTable
            onFetchData={debounce(this.fetchAccount,300)}
            data={data}
            pages={pages}
            columns={[
              {
                Header: 'Action',
                accessor: 'sfid',
                filterable: false,
                sortable: false,
                resizable: false,
                maxWidth: 90,
                Cell: row => (
                  <span>
                    <a href="#" onClick={this.editAccountAction(row.original)}>
                      Edit
                    </a>{' '}
                    |{' '}
                    <a href="#" onClick={this.deleteAccountAction(row.value)}>
                      Delete
                    </a>
                  </span>
                )
              },
              {
                Header: 'Name',
                accessor: 'name'
              },
              {
                Header: 'Web Site',
                accessor: 'website',
                Cell: row => (
                  <span>
                    <a href={row.value} target="_blank">
                      {row.value}
                    </a>
                  </span>
                )
              },
              {
                Header: 'Is Active',
                accessor: 'active__c',
                filterable: false,
                Cell: row => (
                  <span>
                    <span
                      style={{
                        color: row.value === 'Yes' ? '#ffbf00' : '#ff2e00',
                        transition: 'all .3s ease'
                      }}
                    >
                      &#x25cf;
                    </span>{' '}
                    {row.value === 'Yes' ? 'Not Active' : `It's Active`}
                  </span>
                )
              },
              {
                Header: 'City',
                accessor: 'billingcity'
              },
              {
                Header: 'Country',
                accessor: 'billingcountry'
              }
            ]}
            defaultPageSize={10}
            loading={dataLoading}
            manual
            filterable
          />
        </div>
        <footer className="slds-card__footer" />
        {showAccountModal && (
          <AccountForm
            account={account}
            closeAction={this.closeAction}
            onFormSubmitSuccess={this.onFormSubmitSuccess}
            onFormSubmitFail={this.onFormSubmitFail}
          />
        )}
      </article>
    );
  }
}
