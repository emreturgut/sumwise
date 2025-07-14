-- Insert demo user (password: demo123 -> hashed)
-- Note: In production, passwords should be properly hashed with bcrypt
INSERT INTO users (email, password_hash, name, email_verified) VALUES 
('demo@sumwise.ai', '$2b$10$rOZhCG.N1XGN/H4zFzHLXOvW9jKdXtbZzQT8XGXlc5QSKJ8n9oP6.', 'Demo User', true),
('test@example.com', '$2b$10$rOZhCG.N1XGN/H4zFzHLXOvW9jKdXtbZzQT8XGXlc5QSKJ8n9oP6.', 'Test User', false),
('existing@sumwise.ai', '$2b$10$rOZhCG.N1XGN/H4zFzHLXOvW9jKdXtbZzQT8XGXlc5QSKJ8n9oP6.', 'Existing User', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample summaries for demo user
INSERT INTO summaries (user_id, original_url, original_title, summary_text, summary_type) VALUES 
(
    (SELECT id FROM users WHERE email = 'demo@sumwise.ai'),
    'https://example.com/article1',
    'The Future of AI Technology',
    'This article discusses emerging trends in artificial intelligence, including machine learning advances, natural language processing improvements, and the impact on various industries.',
    'general'
),
(
    (SELECT id FROM users WHERE email = 'demo@sumwise.ai'),
    'https://example.com/article2',
    'Web Development Best Practices',
    'Key points: 1) Use modern frameworks like React/Vue, 2) Implement proper security measures, 3) Optimize for performance, 4) Follow accessibility guidelines.',
    'bullet_points'
),
(
    (SELECT id FROM users WHERE email = 'demo@sumwise.ai'),
    'https://example.com/article3',
    'Market Analysis Report 2024',
    'The report reveals significant growth in tech sector, particularly in AI and cloud computing. Key insight: Companies investing in digital transformation show 25% higher growth rates.',
    'key_insights'
); 