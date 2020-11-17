
```
stripe trigger checkout.session.completed
```

```
stripe listen --forward-to localhost:8888/.netlify/functions/money/webhook
```

make sure to update WEBHOOK_SECRET (but often it's the same)