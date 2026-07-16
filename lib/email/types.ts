export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}
