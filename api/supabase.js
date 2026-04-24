// api/supabase.js - Финальная версия
export default async function handler(req, res) {
  // ВАШИ ДАННЫЕ (уже подставлены)
  const SUPABASE_URL = 'https://yusvsnpjvbjntafzownp.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1c3ZzbnBqdmJqbnRhZnpvd25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTkzNjMsImV4cCI6MjA5MTA3NTM2M30.Y202QpgUCKMi5HGObvTWujQUxmP6XRP3K3nEldR5NXQ';
  
  // Получаем полный путь из запроса
  // Пример: /api/supabase/rest/v1/user_settings?select=*
  // -> /rest/v1/user_settings?select=*
  const path = req.url;
  const fullUrl = `${SUPABASE_URL}${path}`;
  
  // Подготавливаем заголовки как у настоящего Supabase клиента
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
  
  // Если клиент передал свой токен (для авторизации пользователя)
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }
  
  const options = {
    method: req.method,
    headers: headers,
  };
  
  // Добавляем тело для POST/PUT/PATCH запросов
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    options.body = JSON.stringify(req.body);
  }
  
  try {
    // Отправляем запрос в Supabase
    const response = await fetch(fullUrl, options);
    
    // Получаем ответ
    const data = await response.json();
    
    // Отправляем обратно клиенту
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy failed', 
      message: error.message,
      url: fullUrl // для отладки
    });
  }
}
