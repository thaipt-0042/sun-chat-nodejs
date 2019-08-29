const config = require('../../../config/config');

module.exports = {
  confirmEmail: (id, token, expired_at) => ({
    subject: 'Application Confirm Email',
    html: `
      <a href='${config.CLIENT_ORIGIN}/confirm/${id}/${token}'>
        click to confirm email
      </a>
      <p>
        Account activation mail will expire at: <b>${expired_at}</b>
      </p>
    `,
    text: `Copy and paste this link: ${
      config.CLIENT_ORIGIN
    }/confirm/${id}/${token}`,
  }),

  resetPassword: (token) => ({
    subject: 'Reset your password',
    html: `
      <a href='${config.CLIENT_ORIGIN}/reset-password?token=${token}'>
        Reset password
      </a>
    `,
  }),
};
