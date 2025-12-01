# Telegram notifier

This is a Telegram notification bot that receives order webhook events and sends formatted messages to a Telegram chat. It runs as a Vercel serverless function that processes POST requests containing order data (ID, number, total price, customer email, and item count) and forwards them as Telegram notifications using the Telegram Bot API.

## How to use

1. Create a Telegram bot via @BotFather and get the bot Token, then get your Chat ID (the ID of the chat where you want to receive notifications)
2. Install dependencies with npm install
3. For local development, create a .env file with TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID variables and start the project. I used the vercel + cloudflared packajes. (Commands: **vercel dev** and in another terminal **cloudflared tunnel --url http://localhost:3000**)
4. Deploy to Vercel and configure the same environment variables in Vercel dashboard
5. Create a Shopify webhook for the orders/create event
6. Use your deployed endpoint URL (e.g., https://your-project.vercel.app/api/webhook) as the webhook URL in Shopify
