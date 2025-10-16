import { Resend } from 'resend';

const resend = new Resend('re_DDdWomfi_GBwGXnQN59bCRsoXQcAZRsK1');

export const sendRecoveryEmail = (email, token) => {
  resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: 'Password Recovery',
  html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">here</a> to reset your password.</p>`
});
}