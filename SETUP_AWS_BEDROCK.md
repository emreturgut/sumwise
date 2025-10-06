# AWS Bedrock Setup Guide

This guide will help you configure AWS Bedrock for the text summarization feature.

## Prerequisites

1. An AWS account with access to AWS Bedrock
2. AWS Bedrock enabled in your desired region (we use `eu-central-1`)
3. Mistral Pixtral Large model access enabled in Bedrock

## Step 1: Enable AWS Bedrock Model Access

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigate to **Model access** in the left sidebar
3. Click **Manage model access**
4. Find **Mistral Pixtral Large** in the list
5. Request access if not already enabled
6. Wait for approval (usually instant for Mistral models)

## Step 2: Create IAM User with Bedrock Permissions

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Add users**
3. Create a user (e.g., `sumwise-bedrock-user`)
4. Attach the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:eu-central-1::foundation-model/eu.mistral.pixtral-large-2502-v1:0"
    }
  ]
}
```

5. Create and save the **Access Key ID** and **Secret Access Key**

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# AWS Bedrock Configuration
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here

# Other existing variables...
DATABASE_URL=postgresql://sumwise_user:sumwise_pass@localhost:5432/sumwise_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Important:** Never commit `.env.local` to version control!

## Step 4: Test the Configuration

### Start the Development Server

```bash
npm run dev
```

### Test the Health Endpoint

```bash
curl http://localhost:3000/api/summarize
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Sumwise Text Summarization",
  "bedrock_available": true,
  "model_id": "eu.mistral.pixtral-large-2502-v1:0",
  "region": "eu-central-1"
}
```

### Test Summarization

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial intelligence (AI) is transforming the way we live and work. From healthcare to finance, AI applications are becoming increasingly prevalent. Machine learning algorithms can now diagnose diseases, predict market trends, and even drive cars. However, with these advancements come important ethical considerations about privacy, job displacement, and algorithmic bias. As we continue to develop AI technologies, it is crucial that we address these challenges thoughtfully and create systems that benefit all of humanity.",
    "summary_length": "short",
    "language": "en"
  }'
```

Expected response:
```json
{
  "summary": "AI is revolutionizing various sectors like healthcare and finance through applications such as disease diagnosis and market prediction. Despite these benefits, ethical concerns regarding privacy, employment, and bias must be addressed to ensure AI serves humanity positively.",
  "original_length": 89,
  "summary_length": 38,
  "detected_language": "en",
  "processing_time": 2.5,
  "model_used": "eu.mistral.pixtral-large-2502-v1:0",
  "chunks_processed": 1
}
```

## Troubleshooting

### Error: "Bedrock client is not initialized"

**Solution:** Check that your AWS credentials are correctly set in `.env.local`

### Error: "ValidationException: The provided model identifier is invalid"

**Solution:** 
1. Verify you have requested access to Mistral Pixtral Large in Bedrock
2. Check that the model is available in your region (`eu-central-1`)
3. If using a different region, update the model ID in `app/api/summarize/route.ts`

### Error: "AccessDeniedException"

**Solution:** Ensure your IAM user has the correct permissions to invoke Bedrock models

### Error: "Region not supported"

**Solution:** AWS Bedrock is not available in all regions. Currently, these regions support Bedrock:
- `us-east-1` (US East - N. Virginia)
- `us-west-2` (US West - Oregon)
- `eu-central-1` (Europe - Frankfurt)
- `ap-southeast-1` (Asia Pacific - Singapore)

## Costs

AWS Bedrock pricing for Mistral Pixtral Large (as of 2025):
- **Input tokens:** ~$0.003 per 1K tokens
- **Output tokens:** ~$0.015 per 1K tokens

Example cost estimation:
- A 1,500-word article (~2,000 tokens) summarized to 300 words (~400 tokens)
- Cost: (2,000 × $0.003/1K) + (400 × $0.015/1K) = $0.006 + $0.006 = **~$0.012 per summary**

For large-scale usage, consider:
1. Implementing caching for repeated summarizations
2. Setting up AWS Budgets alerts
3. Monitoring usage through CloudWatch

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use IAM roles** instead of access keys when deploying to AWS (EC2, ECS, Lambda)
3. **Rotate access keys** regularly
4. **Implement rate limiting** to prevent abuse
5. **Monitor usage** through AWS CloudWatch
6. **Set up billing alerts** to avoid unexpected charges

## Alternative Regions

If you want to use a different region, update these values:

1. In `.env.local`:
```bash
AWS_REGION=us-east-1
```

2. In `app/api/summarize/route.ts`:
```typescript
const BEDROCK_CONFIG = {
    MODEL_ID: "mistral.pixtral-large-2502-v1:0", // Note: Model ID might differ by region
    // ...
    REGION: process.env.AWS_REGION || "us-east-1"
}
```

## Need Help?

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Mistral AI Documentation](https://docs.mistral.ai/)
- [AWS Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)

---

## Quick Reference

### Environment Variables
```bash
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-key-here
AWS_SECRET_ACCESS_KEY=your-secret-here
```

### API Endpoint
```
POST /api/summarize
```

### Required IAM Permissions
```
bedrock:InvokeModel
bedrock:InvokeModelWithResponseStream
```

### Model ID
```
eu.mistral.pixtral-large-2502-v1:0
```

