import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  // 1. Safety Check: Is this actually Stripe calling?
  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body, 
      signature!, 
      Deno.env.get('STRIPE_WEBHOOK_SECRET') as string
    )

    // 2. Logic: What happened in Stripe?
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.client_reference_id // This links the payment to our user

      // 3. Database Connection: Use 'Service Role' to bypass security (internal use only)
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // 4. Update the 'profiles' table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_status: 'active',
          stripe_customer_id: session.customer,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', userId)

      if (error) throw error
      console.log(`Success: Subscription activated for user ${userId}`)
    }

    return new Response(JSON.stringify({ received: true }), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
    })

  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})