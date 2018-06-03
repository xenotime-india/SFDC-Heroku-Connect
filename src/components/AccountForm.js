import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button
} from 'react-lightning-design-system';

export default class AccountForm extends React.Component {
  state = {
    name: '',
    webSite: '',
    city: '',
    country: '',
    description: '',
    sfid: null
  };

  componentDidMount() {
    const {
      name,
      webSite,
      city,
      country,
      description,
      sfid
    } = this.props.account;
    this.setState({
      name,
      webSite,
      city,
      country,
      description,
      sfid
    });
  }

  onInputValueChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleValidation = () => {
    const userName = this.state.name;
    let errorMsg = '';
    if (userName.length === 0) {
      errorMsg = 'Please enter account name';
    }
    return errorMsg;
  };

  onSubmit = () => {
    const { onFormSubmitSuccess, onFormSubmitFail } = this.props;
    const errorMsg = this.handleValidation();
    if (errorMsg.length === 0) {
      onFormSubmitSuccess(this.state);
    } else {
      onFormSubmitFail(errorMsg);
    }
  };

  render() {
    const { closeAction } = this.props;
    const { name, sfid, webSite, city, country } = this.state;
    return (
      <Modal opened onHide={closeAction}>
        <ModalHeader
          title={sfid ? 'Update Account' : 'Create New Account'}
          closeButton
        />
        <ModalContent className="slds-p-around--small">
          <div className="slds-form slds-form_horizontal">
            <div className="slds-form-element">
              <label className="slds-form-element__label" htmlFor="name">
                <abbr className="slds-required" title="required">
                  *
                </abbr>Name
              </label>
              <div className="slds-form-element__control">
                <input
                  type="text"
                  name="name"
                  className="slds-input"
                  required
                  placeholder="Enter Account Name"
                  value={name}
                  onChange={e => this.onInputValueChange(e)}
                />
              </div>
            </div>
            <div className="slds-form-element">
              <label className="slds-form-element__label" htmlFor="webSite">
                Web Site
              </label>
              <div className="slds-form-element__control">
                <input
                  type="url"
                  name="webSite"
                  className="slds-input"
                  placeholder="Enter web site address"
                  value={webSite}
                  onChange={e => this.onInputValueChange(e)}
                />
              </div>
            </div>
            <div className="slds-form-element">
              <label className="slds-form-element__label" htmlFor="city">
                City
              </label>
              <div className="slds-form-element__control">
                <input
                  type="url"
                  name="city"
                  className="slds-input"
                  placeholder="Enter city name"
                  value={city}
                  onChange={e => this.onInputValueChange(e)}
                />
              </div>
            </div>
            <div className="slds-form-element">
              <label className="slds-form-element__label" htmlFor="country">
                Country
              </label>
              <div className="slds-form-element__control">
                <input
                  type="url"
                  name="country"
                  className="slds-input"
                  placeholder="Enter country name"
                  value={country}
                  onChange={e => this.onInputValueChange(e)}
                />
              </div>
            </div>
            <div className="slds-form-element">
              <label className="slds-form-element__label" htmlFor="description">
                Description
              </label>
              <div className="slds-form-element__control">
                <textarea
                  name="description"
                  className="slds-textarea"
                  placeholder="Enter description"
                  value={this.state.description}
                  onChange={e => this.onInputValueChange(e)}
                />
              </div>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button type="neutral" label="Cancel" onClick={closeAction} />
          <Button type="brand" label="Insert" onClick={this.onSubmit} />
        </ModalFooter>
      </Modal>
    );
  }
}
