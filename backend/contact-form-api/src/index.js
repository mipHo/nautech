/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Cloudflare Worker for Contact Form with Resend
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    
    // Allowed origins list
    const allowedOrigins = [
      "https://ammonita.cl",
      "https://www.ammonita.cl",
    ];

    const corsHeaders = {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // If request origin is in the allowed list, allow it
    if (allowedOrigins.includes(origin)) {
      corsHeaders["Access-Control-Allow-Origin"] = origin;
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse request body
      const { name, email, phone, company, message } = await request.json();

      // Validate input
      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email address' }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Send email via Resend
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL,
          to: env.TO_EMAIL,
          subject: `📩 Nuevo mensaje de contacto de ${name}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333;">Nuevo mensaje desde el formulario de contacto</h2>
              <p style="font-size: 15px; color: #555;">Has recibido un nuevo mensaje a través del sitio web.</p>

              <div style="background-color: #fff; border: 1px solid #e2e2e2; padding: 16px; border-radius: 6px; margin-top: 10px;">
                <p><strong>👤 Nombre:</strong> ${name}</p>
                <p><strong>📧 Correo electrónico:</strong> <a href="mailto:${email}">${email}</a></p>
                ${phone ? `<p><strong>📱 Teléfono:</strong> ${phone}</p>` : ''}
                ${company ? `<p><strong>🏢 Empresa:</strong> ${company}</p>` : ''}
                <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
                <p><strong>💬 Mensaje:</strong></p>
                <p style="white-space: pre-line; color: #333;">${message.replace(/\n/g, '<br>')}</p>
              </div>

              <p style="font-size: 13px; color: #777; margin-top: 20px;">Este mensaje fue enviado desde el formulario de contacto de ammonita.cl.</p>
            </div>
          `,
          reply_to: email,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        console.error('Resend API error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to send email' }),
          { 
            status: 500,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json',
            }
          }
        );
      }

      const result = await resendResponse.json();

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully',
          id: result.id 
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );

    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }
  },
};