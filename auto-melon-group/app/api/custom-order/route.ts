import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.fullName || !body.email || !body.phone || !body.truckType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if Resend is configured
    if (!resend) {
      console.error('Resend API key not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly.' },
        { status: 503 }
      )
    }

    // Format features list
    const featuresList = body.specialFeatures && body.specialFeatures.length > 0
      ? `<ul>${body.specialFeatures.map((f: string) => `<li>${f}</li>`).join('')}</ul>`
      : '<p style="color: #666;">No special features requested</p>'

    // Send email using Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Auto Melon Group <onboarding@resend.dev>'
    const toEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@melonautogroup.com'

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: body.email,
      subject: `New Custom Truck Order from ${body.fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 700px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
              .section { background-color: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #ea580c; }
              .section-title { color: #ea580c; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #ea580c; padding-bottom: 8px; }
              .field { margin-bottom: 12px; }
              .label { font-weight: bold; color: #555; display: inline-block; min-width: 180px; }
              .value { color: #333; display: inline-block; }
              ul { margin: 10px 0; padding-left: 20px; }
              li { margin: 5px 0; }
              .footer { margin-top: 20px; padding: 20px; text-align: center; color: #666; font-size: 12px; background-color: #f0f0f0; border-radius: 0 0 8px 8px; }
              .badge { display: inline-block; background-color: #ea580c; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-left: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚚 New Custom Truck Order</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Custom order request received</p>
              </div>
              <div class="content">
                <!-- Customer Information -->
                <div class="section">
                  <div class="section-title">👤 Customer Information</div>
                  <div class="field">
                    <span class="label">Name:</span>
                    <span class="value">${body.fullName}</span>
                  </div>
                  <div class="field">
                    <span class="label">Email:</span>
                    <span class="value"><a href="mailto:${body.email}">${body.email}</a></span>
                  </div>
                  <div class="field">
                    <span class="label">Phone:</span>
                    <span class="value"><a href="tel:${body.phone}">${body.phone}</a></span>
                  </div>
                  ${body.company ? `
                  <div class="field">
                    <span class="label">Company:</span>
                    <span class="value">${body.company}</span>
                  </div>
                  ` : ''}
                </div>

                <!-- Truck Specifications -->
                <div class="section">
                  <div class="section-title">🚛 Truck Specifications</div>
                  <div class="field">
                    <span class="label">Truck Type:</span>
                    <span class="value">${body.truckType}<span class="badge">PRIMARY</span></span>
                  </div>
                  <div class="field">
                    <span class="label">Preferred Make:</span>
                    <span class="value">${body.preferredMake}</span>
                  </div>
                  ${body.engineType ? `
                  <div class="field">
                    <span class="label">Engine Type:</span>
                    <span class="value">${body.engineType}</span>
                  </div>
                  ` : ''}
                  ${body.transmission ? `
                  <div class="field">
                    <span class="label">Transmission:</span>
                    <span class="value">${body.transmission}</span>
                  </div>
                  ` : ''}
                  ${body.axleConfiguration ? `
                  <div class="field">
                    <span class="label">Axle Configuration:</span>
                    <span class="value">${body.axleConfiguration}</span>
                  </div>
                  ` : ''}
                  ${body.horsepowerMin ? `
                  <div class="field">
                    <span class="label">Minimum Horsepower:</span>
                    <span class="value">${body.horsepowerMin} HP</span>
                  </div>
                  ` : ''}
                  ${body.gvwMin ? `
                  <div class="field">
                    <span class="label">Minimum GVW:</span>
                    <span class="value">${body.gvwMin} kg</span>
                  </div>
                  ` : ''}
                  ${body.cabType ? `
                  <div class="field">
                    <span class="label">Cab Type:</span>
                    <span class="value">${body.cabType}</span>
                  </div>
                  ` : ''}
                  ${body.emissionStandard ? `
                  <div class="field">
                    <span class="label">Emission Standard:</span>
                    <span class="value">${body.emissionStandard}</span>
                  </div>
                  ` : ''}
                </div>

                <!-- Special Features -->
                <div class="section">
                  <div class="section-title">⭐ Special Features</div>
                  ${featuresList}
                </div>

                <!-- Budget & Timeline -->
                <div class="section">
                  <div class="section-title">💰 Budget & Timeline</div>
                  <div class="field">
                    <span class="label">Budget Range:</span>
                    <span class="value">${body.budgetRange}</span>
                  </div>
                  <div class="field">
                    <span class="label">Desired Delivery:</span>
                    <span class="value">${body.desiredDelivery}</span>
                  </div>
                  ${body.currentFleetSize ? `
                  <div class="field">
                    <span class="label">Current Fleet Size:</span>
                    <span class="value">${body.currentFleetSize} vehicles</span>
                  </div>
                  ` : ''}
                </div>

                <!-- Requirements -->
                <div class="section">
                  <div class="section-title">📋 Requirements & Intended Use</div>
                  ${body.customRequirements ? `
                  <div class="field" style="margin-bottom: 15px;">
                    <span class="label" style="display: block; margin-bottom: 8px;">Custom Requirements:</span>
                    <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-wrap;">${body.customRequirements}</div>
                  </div>
                  ` : ''}
                  ${body.intendedUse ? `
                  <div class="field">
                    <span class="label" style="display: block; margin-bottom: 8px;">Intended Use:</span>
                    <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-wrap;">${body.intendedUse}</div>
                  </div>
                  ` : ''}
                </div>

                <!-- Trade-in & Financing -->
                ${body.tradeInAvailable || body.financingNeeded ? `
                <div class="section">
                  <div class="section-title">💼 Additional Services</div>
                  ${body.tradeInAvailable ? `
                  <div class="field" style="margin-bottom: 15px;">
                    <span class="label" style="display: block; margin-bottom: 8px;">Trade-in Available:</span>
                    <span class="badge" style="margin-left: 0;">YES</span>
                    ${body.tradeInDetails ? `
                    <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; margin-top: 8px; white-space: pre-wrap;">${body.tradeInDetails}</div>
                    ` : ''}
                  </div>
                  ` : ''}
                  ${body.financingNeeded ? `
                  <div class="field">
                    <span class="label">Financing Needed:</span>
                    <span class="badge" style="margin-left: 0;">YES</span>
                  </div>
                  ` : ''}
                </div>
                ` : ''}
              </div>
              <div class="footer">
                <p><strong>This email was sent from the Auto Melon Group custom order form.</strong></p>
                <p>Reply directly to this email to respond to ${body.fullName}.</p>
                <p style="margin-top: 15px; color: #999;">Auto Melon Group | Commercial Vehicle Specialists</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Custom order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
