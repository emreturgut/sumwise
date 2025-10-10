#!/usr/bin/env node

/**
 * Test script for the /api/summarize endpoint
 * 
 * Usage:
 *   node test-summarize.js
 *   node test-summarize.js --short
 *   node test-summarize.js --long
 *   node test-summarize.js --bullets
 */

const sampleTexts = {
    turkish: `
Yapay zeka (AI), günümüzün en önemli teknolojik gelişmelerinden biridir. Sağlıktan finansa, 
eğitimden üretime kadar birçok alanda devrim yaratmaktadır. Makine öğrenimi algoritmaları 
sayesinde bilgisayarlar artık hastalıkları teşhis edebiliyor, borsa trendlerini tahmin 
edebiliyor ve hatta araç kullanabiliyor. Derin öğrenme teknikleri, görüntü tanıma, doğal 
dil işleme ve konuşma sentezleme gibi alanlarda insanüstü performans göstermektedir.

Ancak bu gelişmeler beraberinde önemli etik sorunlar da getirmektedir. Gizlilik, iş kaybı, 
algoritmik önyargı ve yapay zekanın kötüye kullanılması gibi konular toplumsal tartışmaların 
odağındadır. Özellikle yapay zekanın karar verme süreçlerinde kullanılması, şeffaflık ve 
hesap verebilirlik konularını gündeme getirmektedir.

Yapay zeka teknolojilerini geliştirirken, bu zorlukların üstesinden düşünceli bir şekilde 
gelmeli ve tüm insanlığa fayda sağlayan sistemler oluşturmalıyız. Yapay zeka etiği, yapay 
zeka güvenliği ve yapay zeka yönetişimi gibi konular, teknolojinin sorumlu bir şekilde 
geliştirilmesi için kritik öneme sahiptir. Ayrıca, yapay zeka sistemlerinin adil, kapsayıcı 
ve sürdürülebilir olması için çok paydaşlı bir yaklaşım benimsenmelidir.

Gelecekte yapay zekanın eğitim, sağlık ve bilim alanlarında daha da büyük bir rol oynaması 
beklenmektedir. Kişiselleştirilmiş öğrenme, hassas tıp ve bilimsel keşifler, yapay zekanın 
potansiyel faydalarından sadece birkaçıdır. Ancak bu potansiyeli gerçekleştirmek için, 
teknolojinin etik ilkelere uygun olarak geliştirilmesi ve kullanılması gerekmektedir.
`,
    english: `
Artificial intelligence (AI) represents one of the most significant technological 
advancements of our time. It is revolutionizing numerous sectors, from healthcare to 
finance, education to manufacturing. Through machine learning algorithms, computers can 
now diagnose diseases, predict market trends, and even drive vehicles autonomously. 
Deep learning techniques have achieved superhuman performance in areas such as image 
recognition, natural language processing, and speech synthesis.

However, these developments come with important ethical considerations. Privacy concerns, 
job displacement, algorithmic bias, and the potential misuse of AI are at the center of 
societal debates. The use of AI in decision-making processes particularly raises questions 
about transparency and accountability.

As we continue to develop AI technologies, we must address these challenges thoughtfully 
and create systems that benefit all of humanity. AI ethics, AI safety, and AI governance 
are critical areas that need attention to ensure responsible development. Moreover, a 
multi-stakeholder approach is necessary to ensure that AI systems are fair, inclusive, 
and sustainable.

Looking ahead, AI is expected to play an even larger role in education, healthcare, and 
scientific research. Personalized learning, precision medicine, and scientific discoveries 
are just a few potential benefits. However, realizing this potential requires that the 
technology be developed and deployed in accordance with ethical principles.
`
}

async function testSummarize(options = {}) {
    const {
        text = sampleTexts.english,
        language = 'en',
        summaryLength = 'medium',
        bulletPoints = false,
        baseUrl = 'http://localhost:3000'
    } = options

    console.log('\n🚀 Testing Text Summarization Endpoint\n')
    console.log('Configuration:')
    console.log(`  - Language: ${language}`)
    console.log(`  - Summary Length: ${summaryLength}`)
    console.log(`  - Bullet Points: ${bulletPoints}`)
    console.log(`  - Text Length: ${text.trim().split(/\s+/).length} words\n`)

    try {
        console.log('📡 Sending request to', `${baseUrl}/api/summarize`, '...\n')
        
        const startTime = Date.now()
        const response = await fetch(`${baseUrl}/api/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text.trim(),
                language,
                summary_length: summaryLength,
                bullet_points: bulletPoints
            })
        })

        const data = await response.json()
        const requestTime = ((Date.now() - startTime) / 1000).toFixed(2)

        if (!response.ok) {
            console.error('❌ Error:', data.error)
            if (data.details) {
                console.error('Details:', data.details)
            }
            process.exit(1)
        }

        console.log('✅ Summary generated successfully!\n')
        console.log('📊 Statistics:')
        console.log(`  - Original Length: ${data.original_length} words`)
        console.log(`  - Summary Length: ${data.summary_length} words`)
        console.log(`  - Compression Ratio: ${(data.summary_length / data.original_length * 100).toFixed(1)}%`)
        console.log(`  - Detected Language: ${data.detected_language}`)
        console.log(`  - Processing Time: ${data.processing_time}s (server) / ${requestTime}s (total)`)
        console.log(`  - Model Used: ${data.model_used}`)
        console.log(`  - Chunks Processed: ${data.chunks_processed}\n`)
        
        console.log('💰 Cost Estimate:')
        console.log(`  - Input Tokens: ${data.cost_estimate.input_tokens.toLocaleString()}`)
        console.log(`  - Output Tokens: ${data.cost_estimate.output_tokens.toLocaleString()}`)
        console.log(`  - Input Cost: $${data.cost_estimate.input_cost_usd.toFixed(6)}`)
        console.log(`  - Output Cost: $${data.cost_estimate.output_cost_usd.toFixed(6)}`)
        console.log(`  - Total Cost: $${data.cost_estimate.total_cost_usd.toFixed(6)}\n`)
        
        console.log('📝 Summary:')
        console.log('─'.repeat(80))
        console.log(data.summary)
        console.log('─'.repeat(80))
        console.log('\n✨ Test completed successfully!\n')

    } catch (error) {
        console.error('\n❌ Test failed:', error.message)
        console.error('\nMake sure:')
        console.error('  1. The development server is running (npm run dev)')
        console.error('  2. AWS credentials are configured in .env.local')
        console.error('  3. The server is accessible at', baseUrl)
        process.exit(1)
    }
}

async function testHealth(baseUrl = 'http://localhost:3000') {
    console.log('\n🏥 Testing Summarization Service Health\n')
    
    try {
        const response = await fetch(`${baseUrl}/api/summarize`)
        const data = await response.json()
        
        if (data.bedrock_available) {
            console.log('✅ Service is healthy')
            console.log(`  - Status: ${data.status}`)
            console.log(`  - Service: ${data.service}`)
            console.log(`  - Bedrock Available: ${data.bedrock_available}`)
            console.log(`  - Model ID: ${data.model_id}`)
            console.log(`  - Region: ${data.region}\n`)
        } else {
            console.log('⚠️  Service is running but Bedrock is not available')
            console.log('   Check your AWS credentials in .env.local\n')
        }
    } catch (error) {
        console.error('❌ Health check failed:', error.message)
        console.error('   Make sure the development server is running\n')
        process.exit(1)
    }
}

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
    summaryLength: 'medium',
    bulletPoints: false,
    language: 'en',
    text: sampleTexts.english
}

if (args.includes('--short')) {
    options.summaryLength = 'short'
} else if (args.includes('--long')) {
    options.summaryLength = 'long'
}

if (args.includes('--bullets')) {
    options.bulletPoints = true
}

if (args.includes('--turkish') || args.includes('--tr')) {
    options.language = 'tr'
    options.text = sampleTexts.turkish
}

if (args.includes('--health')) {
    testHealth().catch(console.error)
} else {
    // Run health check first, then summarization test
    testHealth()
        .then(() => testSummarize(options))
        .catch(console.error)
}

