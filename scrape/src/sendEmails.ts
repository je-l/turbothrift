import initMailgun from "mailgun-js";
import { env } from "process";

const MAILGUN_API_KEY = env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = env.MAILGUN_DOMAIN;
const EMAIL_SENDER_NAME = env.EMAIL_SENDER_NAME;
const EMAIL_SENDER_ADDRESS = env.EMAIL_SENDER_ADDRESS;

if (
  !MAILGUN_API_KEY ||
  !MAILGUN_DOMAIN ||
  !EMAIL_SENDER_ADDRESS ||
  !EMAIL_SENDER_NAME
) {
  console.error("check .env file for missing configuration");
  process.exit(1);
}

const mailgun = initMailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
});

export interface EmailMesssage {
  to: string;
  message: string;
}

export const sendEmailsForUser = async (email: EmailMesssage) => {
  const sendData = {
    from: `${EMAIL_SENDER_NAME} <${EMAIL_SENDER_ADDRESS}>`,
    to: email.to,
    subject: "New items in Turbothrift",
    text: email.message,
  };
  await mailgun.messages().send(sendData);
  console.log(`sent email to ${email.to}`);
};
