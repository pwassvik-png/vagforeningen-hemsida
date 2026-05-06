import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "Skogstorp-Gunntorp <no-reply@skogstorp-gunntorp.se>",
}: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return { id: "skipped" };
  }

  return resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}

// === Specifika e-postmallar ===

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Välkommen till Skogstorp-Gunntorps medlemsportal",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d5016;">Välkommen, ${name}!</h1>
        <p>Ditt konto i Skogstorp-Gunntorps medlemsportal har skapats.</p>
        <p>Du kan nu logga in och:</p>
        <ul>
          <li>Se nyheter och kungörelser</li>
          <li>Rapportera vägproblem</li>
          <li>Se dokument och protokoll</li>
          <li>Kontrollera din avgift</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login"
           style="background: #2d5016; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
          Logga in
        </a>
      </div>
    `,
  });
}

export async function sendFeeReminder(to: string, name: string, amount: number, dueDate: string) {
  return sendEmail({
    to,
    subject: "Påminnelse: Årsavgift förfallen",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d5016;">Påminnelse om årsavgift</h1>
        <p>Hej ${name},</p>
        <p>Din årsavgift på <strong>${amount.toLocaleString("sv-SE")} kr</strong> har inte registrerats som betald.</p>
        <p>Sista betalningsdag var <strong>${dueDate}</strong>.</p>
        <p>Vänligen betala till föreningskonto så snart som möjligt.</p>
      </div>
    `,
  });
}

export async function sendMeetingNotice(
  to: string,
  name: string,
  meetingTitle: string,
  meetingDate: string,
  meetingTime: string,
  meetingLocation: string
) {
  return sendEmail({
    to,
    subject: `Kallelse: ${meetingTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d5016;">Kallelse till ${meetingTitle}</h1>
        <p>Hej ${name},</p>
        <p>Du kallas härmed till:</p>
        <div style="background: #f5f5f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Datum:</strong> ${meetingDate}</p>
          <p><strong>Tid:</strong> ${meetingTime}</p>
          <p><strong>Plats:</strong> ${meetingLocation}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/meetings"
           style="background: #2d5016; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
          Se mer i portalen
        </a>
      </div>
    `,
  });
}

export async function sendIssueNotification(
  to: string,
  issueCategory: string,
  issueDescription: string
) {
  return sendEmail({
    to,
    subject: `Ny problemrapport: ${issueCategory}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d5016;">Ny problemrapport</h1>
        <p>En ny problemrapport har registrerats:</p>
        <div style="background: #f5f5f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Kategori:</strong> ${issueCategory}</p>
          <p><strong>Beskrivning:</strong> ${issueDescription}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/issues"
           style="background: #2d5016; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
          Hantera i portalen
        </a>
      </div>
    `,
  });
}