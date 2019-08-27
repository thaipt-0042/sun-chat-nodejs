
import React, { Fragment } from 'react';
import 'antd/dist/antd.css';
import { resendActiveMail } from './../../api/auth.js';
import { Form, Icon, Input, Button, Alert } from 'antd';
import { PrivateIcon } from './../../components/PrivateIcon';
import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { authValidate } from './../../config/validate';
import Loading from './../../components/Loading';

class resendMail extends React.Component {
  // State and props in properties
  state = {
    is_resend: false,
    error: '',
    errors: {},
    isLoading: false,
    messages: ''
  };

  rules = {
    email: {
      validateFirst: true,
      rules: [
        { required: true, message: this.props.t('validate.email.required') },
        {
          pattern: authValidate.email.pattern,
          message: this.props.t('validate.email.regex'),
        },
        {
          max: authValidate.email.maxLength,
          message: this.props.t('validate.email.length', { max: authValidate.email.maxLength }),
        },
      ],
    },
  };

  handleResendActiveMail = e => {
    this.setState({
      isLoading: true,
      error: ''
    });

    const { email } = this.props.form.getFieldsValue();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        resendActiveMail({
          email: email,
        })
        .then(res => {
          this.setState({
            is_resend: true,
            messages: res.data.msg,
          });
        })
        .catch(err => {
          this.setState({
            error: err.response.data.err,
            isLoading: false,
            errors: err.response.data.err ? {} : err.response.data,
          });
        });
      }
    });
  };

  render() {
    let { is_resend, error, errors, isLoading, messages } = this.state;
    const { form, t } = this.props;
    let contentHTML = '';

    if (is_resend === false) {
      contentHTML = (
        <div className="form">
          <Form className="login-form">
            {isLoading && <Loading />}
            <h2 className="logo">
              <Icon style={{ fontSize: 100, color: '#40A9FF' }} theme="outlined" component={PrivateIcon} />
            </h2>
            {error && (
              <Form.Item>
                <Alert message="Error" description={error} type="error" showIcon />
              </Form.Item>
            )}
            <Form.Item
              help={
                form.getFieldError('email') ? (
                  form.getFieldError('email')
                ) : errors && errors.email ? (
                  <span className="error-message-from-server">{errors.email}</span>
                ) : (
                  ''
                )
              }
            >
              {form.getFieldDecorator('email', this.rules.email)(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder={t('email')} />
              )}
            </Form.Item>
            <Form.Item>
              <Button className="login-form-button" type="primary" value="Log in" onClick={this.handleResendActiveMail}>
                {t('resend_mail_resgister')}
              </Button>
              <div>
                <a className="login-form-forgot" href="/register">
                  {t('register')}
                </a>
                <a style={{ float: 'right' }} href="/login">
                  {t('login')}
                </a>
              </div>
            </Form.Item>
          </Form>
        </div>
      );
    } else {
      contentHTML = (
        <div className="form">
          <Form className="login-form">
            <h1> {messages} </h1>
            <a href="/login"> {t('login')} </a>
          </Form>
        </div>
      );
    }
    return <Fragment>{contentHTML}</Fragment>;
  }
}

resendMail = Form.create()(resendMail);

export default withNamespaces(['auth'])(withRouter(resendMail));
