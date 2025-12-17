import axios from 'axios';

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.model = 'llama-3.3-70b-versatile';
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async getCurrencyInsight(currencyData, marketNews) {
    const cacheKey = `${currencyData.pair}_${Date.now() - (Date.now() % this.cacheExpiry)}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (!this.apiKey) {
      console.error('GROQ_API_KEY not configured');
      return null;
    }

    try {
      const newsArray = Array.isArray(marketNews) ? marketNews : [];
      const prompt = this.buildPrompt(currencyData, newsArray);

      console.log(`\n🤖 Analyzing ${currencyData.pair} (${currencyData.change}%) with ${newsArray.length} news items`);

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are an expert currency analyst for import/export businesses. Provide concise, actionable insights.

CRITICAL RULES:
- DO NOT repeat the currency name (it's already shown in the card header)
- Be extremely concise: 2 sentences max, 150-180 characters total
- Cite specific events with numbers
- Give actionable advice

Format Examples:
"Stable despite Fed hawkish signals as RBI intervenes. Watch Q1 Fed decisions - hedge long-term contracts."

"Down 0.8% on weak eurozone PMI data. Good time for bulk orders before ECB rate cut."

"Up 1.2% after BoE held rates. Delay non-urgent purchases - could rise another 1-2% this quarter."

"Stable as Dow dropped 302pts with minimal impact. Watch risk-off sentiment - consider hedging 1-2% decline."

Your response structure:
1. Movement + key event (with numbers)
2. Actionable advice for importers

Never write: "USD/INR" or "dollar" or "euro" - just describe the situation and give advice.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 120,
          top_p: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      let insight = response.data.choices[0].message.content.trim();

      // Limit to 2 sentences max
      const sentences = insight.split('.');
      if (sentences.length > 2) {
        insight = sentences.slice(0, 2).join('.') + '.';
      }

      // Ensure it ends with proper punctuation
      if (!insight.endsWith('.')) {
        insight += '.';
      }

      // Limit to 180 characters but try not to cut mid-sentence
      if (insight.length > 180) {
        const lastPeriod = insight.substring(0, 180).lastIndexOf('.');
        if (lastPeriod > 120) {
          insight = insight.substring(0, lastPeriod + 1);
        } else {
          insight = insight.substring(0, 180).trim() + '...';
        }
      }

      insight = insight.trim();

      console.log(`✅ "${insight}"\n`);

      this.cache.set(cacheKey, insight);

      // Clean old cache
      if (this.cache.size > 100) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      return insight;
    } catch (error) {
      console.error(`Groq API Error:`, error.response?.data || error.message);
      return null;
    }
  }

  buildPrompt(currencyData, marketNews) {
    const { pair, change } = currencyData;

    let prompt = '';

    // Add movement context
    const changeValue = parseFloat(change) || 0;
    if (changeValue === 0) {
      prompt = `${pair} is currently stable (0% change today).\n\n`;
    } else if (changeValue > 0) {
      prompt = `${pair} is UP +${change}% today.\n\n`;
    } else {
      prompt = `${pair} is DOWN ${change}% today.\n\n`;
    }

    // Add news context
    if (marketNews && marketNews.length > 0) {
      prompt += `Latest Market News (last 24 hours):\n`;
      marketNews.slice(0, 5).forEach((news, index) => {
        if (news && news.title) {
          prompt += `${index + 1}. ${news.title}\n`;
        }
      });
      prompt += `\n`;
    } else {
      prompt += `No significant news in last 24 hours.\n\n`;
    }

    // Add specific instructions based on movement
    if (changeValue === 0) {
      prompt += `Analyze the news above and explain:\n`;
      prompt += `1. What factors are keeping ${pair} stable\n`;
      prompt += `2. What trends or risks to watch from the news\n`;
      prompt += `3. Actionable advice for importers dealing with ${pair.split('/')[0]}`;
    } else {
      prompt += `Analyze the news and explain:\n`;
      prompt += `1. Which specific news event(s) caused this ${changeValue > 0 ? 'rise' : 'fall'}\n`;
      prompt += `2. Import cost impact for businesses\n`;
      prompt += `3. Outlook and what to watch next`;
    }

    return prompt;
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new GroqService();
