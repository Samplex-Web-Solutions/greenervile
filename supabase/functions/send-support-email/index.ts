import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, comment } = await req.json()

    // Call Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
  from: 'Greener Vile System <system@greenervileinc.com>',
  to: 'support@greenervileinc.com',
  subject: `🔔 New Inquiry: ${name}`,
  html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 30px; text-align: center;">
        <h1 style="color: #10b981; margin: 0; font-size: 24px; letter-spacing: -0.5px;">Greener Vile</h1>
        <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; tracking: 0.1em;">Investor Support Portal</p>
      </div>

      <div style="padding: 40px 30px; background-color: #ffffff;">
        <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">New Website Comment</h2>
        <p style="color: #64748b; line-height: 1.6;">You have received a new message from the contact form on <strong>greenervileinc.com</strong>.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 12px; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 10px 0; color: #475569; font-size: 14px;"><strong>Sender Details:</strong></p>
          <p style="margin: 0; color: #0f172a;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0 0 0; color: #0f172a;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a></p>
        </div>

        <div style="margin-bottom: 30px;">
          <p style="color: #475569; font-size: 14px; margin-bottom: 10px;"><strong>Message Content:</strong></p>
          <p style="color: #1e293b; line-height: 1.8; background-color: #ffffff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px;">
            ${comment}
          </p>
        </div>

        <a href="mailto:${email}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 14px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
          Reply to ${name}
        </a>
      </div>

      <div style="padding: 20px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          © 2026 Greener Vile Asset Management. All rights reserved.<br>
          This is an automated notification from your Supabase Edge Function.
        </p>
      </div>
    </div>
  `,
}),
    })

    const result = await res.json()
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})