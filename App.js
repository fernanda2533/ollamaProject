import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, ScrollView, TextInput, Button, ActivityIndicator } from 'react-native';

const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions'; // URL da API Groq

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt) return; // Não envia se o prompt estiver vazio

    setLoading(true);
    setMessages(prevMessages => [...prevMessages, { role: 'user', content: prompt }]); // Adiciona a mensagem do usuário

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: prompt }
          ],
          model: "llama-3.2-1b-preview",
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: false, // Para simplificar, use false para não usar streaming
          stop: null
        }),
      });

      const data = await response.json();
      const botReply = data.choices[0]?.message?.content || 'Desculpe, não consegui responder.';
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: botReply }]); // Adiciona a resposta do bot
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Erro ao obter resposta da IA.' }]);
    } finally {
      setLoading(false);
      setPrompt(''); // Limpa o campo de entrada
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image source={require('')} style={styles.backgroundImage} />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {messages.map((msg, index) => (
            <View key={index}>
              <Text style={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
                {msg.role === 'user' ? `:User   ${msg.content}` : `Bot: ${msg.content}`}
              </Text>
            </View>
          ))}
          {loading && <ActivityIndicator size="small" color="#0000ff" />}
        </ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Digite sua pergunta aqui..."
          value={prompt}
          onChangeText={setPrompt}
        />
        <TouchableOpacity style={styles.button} onPress={sendPrompt} disabled={loading}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    opacity: 0.5, // Para dar um efeito sutil
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  scrollView: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  userMessage: {
    color: 'blue',
    marginVertical: 5,
    fontSize: 16,
  },
  botMessage: {
    color: 'green',
    marginVertical: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
