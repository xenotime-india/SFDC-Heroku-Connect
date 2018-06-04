import React from 'react';
import { Icon } from 'react-lightning-design-system';

import { DataTable } from './../components/DataTable/DataTable';
import SuccessMessage from './../components/SuccessMessage';
import ErrorMessage from './../components/ErrorMessage';
import { REACT_APP_API_URL } from './../constants';
import { getToken } from './../services/authentication';
import { debounce } from 'lodash';

export default class SalesforceRest extends React.Component {
  state = {
    isSuccessMessage: false,
    isErrorMessage: false,
    isLoading: false,
    errorMsg: '',
    successMsg: '',
    data: [],
    pages: -1,
    dataLoading: false
  };

  filtering = false;

  onFilteredChange = (column, value) => {
    this.filtering = true;
  };

  fetchStrategy = async tableState => {
    if (this.filtering) {
      return await debounce(this.fetchContacts, 700)(tableState);
    } else {
      return await this.fetchContacts(tableState);
    }
  };

  alertClose = () => {
    this.setState({
      isSuccessMessage: false,
      isErrorMessage: false
    });
  };

  fetchContacts = async tableState => {
    this.setState({
      dataLoading: true,
      isErrorMessage: false,
      isSuccessMessage: false
    });
    const { pageSize, page, sorted, filtered } = tableState;
    const [sortby] = sorted;
    const paylod = {
      pageSize,
      page: page + 1,
      sortby,
      filtered
    };
    const { access_token } = getToken();
    const url = `${REACT_APP_API_URL.URL}/api/contact/fetch`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(paylod)
    };
    const result = await fetch(url, options);
    const { data, pagination } = await result.json();
    this.setState({
      data,
      pages: Math.ceil(pagination / pageSize),
      dataLoading: false
    });
  };

  deleteContact = async contactId => {
    this.setState({
      isLoading: true,
      isErrorMessage: false,
      isSuccessMessage: false
    });
    const url = `${REACT_APP_API_URL.URL}/api/contact/delete?id=${contactId}`;
    const options = {
      method: 'DELETE'
    };
    const result = await fetch(url, options);
    return result.ok ? await result.json() : null;
  };

  deleteContactAction = sfid => async () => {
    this.setState({
      isLoading: true,
      isErrorMessage: false,
      isSuccessMessage: false
    });
    const response = await this.deleteContact(sfid);
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
      isSuccessMessage,
      successMsg,
      isErrorMessage,
      errorMsg,
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
                <Icon icon="standard:contact" /> Contacts
              </span>
            </div>
          </header>
          <div className="slds-no-flex" />
        </div>
        <div className="slds-card__body">
          <DataTable
            onFetchData={this.fetchStrategy}
            onFilteredChange={this.onFilteredChange}
            data={data}
            pages={pages}
            columns={[
              {
                Header: 'Action',
                accessor: 'id',
                filterable: false,
                sortable: false,
                resizable: false,
                maxWidth: 90,
                Cell: row => (
                  <span>
                    <a href="#" onClick={this.deleteContactAction(row.value)}>
                      Delete
                    </a>
                  </span>
                )
              },
              {
                Header: 'Name',
                accessor: 'Name'
              },
              {
                Header: 'Account',
                accessor: 'Account.Name'
              },
              {
                Header: 'Email',
                accessor: 'Email'
              },
              {
                Header: 'Phone',
                accessor: 'Phone'
              },
              {
                Header: 'Department',
                accessor: 'Department'
              }
            ]}
            defaultPageSize={10}
            loading={dataLoading}
            manual
            filterable
          />
        </div>
        <footer className="slds-card__footer" />
      </article>
    );
  }
}
