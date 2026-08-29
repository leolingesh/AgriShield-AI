const { isOllamaAvailable, askOllama } = require('../server/services/ollamaService');

async function test() {
  console.log('Testing Ollama connectivity...');
  const status = await isOllamaAvailable();
  console.log('Ollama Status:', status);

  if (status.available) {
    console.log('Testing question query with Ollama...');
    const answer = await askOllama({
      question: 'How to treat early leaf spot on tomato plants naturally?',
      cropContext: 'Tomato',
      conditionContext: 'Septoria Leaf Spot',
      language: 'en'
    });
    console.log('Ollama Answer:\n', answer);
  }
}

test().catch(console.error);
