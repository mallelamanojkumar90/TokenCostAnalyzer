import type { ExamplePrompt } from '../types';

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    title: 'Good: Concise Task Description',
    type: 'good',
    prompt: 'Write a Python function to calculate fibonacci numbers using memoization.',
    explanation: 'Clear, specific, and concise. Gets straight to the point without unnecessary words.'
  },
  {
    title: 'Bad: Overly Verbose',
    type: 'bad',
    prompt: 'I would really appreciate it if you could possibly help me out by writing a Python function that would be able to calculate the fibonacci numbers. I think it would be really great if you could use memoization for this because I have heard that it is a very efficient approach and I really want to make sure that the code runs as fast as possible. Could you please make sure to include comments as well because I am still learning and I really need to understand what is going on in the code?',
    explanation: 'Contains excessive filler words ("really", "possibly", "I think"), redundant phrases, and could be 80% shorter while conveying the same information.'
  },
  {
    title: 'Good: Structured Request',
    type: 'good',
    prompt: 'Create a REST API endpoint for user authentication with:\n- Email/password login\n- JWT token generation\n- Input validation\n- Error handling',
    explanation: 'Well-structured with bullet points. Clear requirements without redundancy.'
  },
  {
    title: 'Bad: Repetitive Context',
    type: 'bad',
    prompt: 'I need help with creating a REST API. The REST API should handle user authentication. For the user authentication in the REST API, I want to use email and password. The REST API should generate JWT tokens for authentication. The REST API needs input validation. The REST API should have error handling.',
    explanation: 'Repeats "REST API" unnecessarily in every sentence. Could be condensed significantly.'
  },
  {
    title: 'Good: Direct Question',
    type: 'good',
    prompt: 'What are the key differences between React hooks and class components?',
    explanation: 'Direct question without preamble. Efficient and clear.'
  },
  {
    title: 'Bad: Excessive Context',
    type: 'bad',
    prompt: 'So I have been learning React for a while now, and I have been using class components, but I recently heard about these things called hooks, and I am really curious about them. I was wondering if you could explain to me what the differences are between React hooks and class components, because I am trying to decide which one I should use for my next project, and I really want to make the right choice here.',
    explanation: 'Buries the actual question in unnecessary backstory. The question could be asked in 10% of the tokens.'
  },
  {
    title: 'Good: Code Review Request',
    type: 'good',
    prompt: 'Review this SQL query for performance issues:\n```sql\nSELECT * FROM users WHERE email LIKE \'%@gmail.com\'\n```',
    explanation: 'Includes only necessary context. Code is properly formatted.'
  },
  {
    title: 'Bad: Unfocused Request',
    type: 'bad',
    prompt: 'Hi there! I hope you are doing well today. I have a question about SQL queries. I have been working on this project and I wrote this query: SELECT * FROM users WHERE email LIKE \'%@gmail.com\' and I am not sure if it is good or not. I think it might be slow but I am not really sure. Could you maybe take a look at it and tell me if there are any problems with it? Also, if you have any suggestions for making it better, that would be really helpful. Thanks so much!',
    explanation: 'Contains greetings, hedging language, and repetitive phrasing. The actual query is buried in conversational fluff.'
  },
  {
    title: 'Good: Debugging Help',
    type: 'good',
    prompt: 'Debug this error:\n```\nTypeError: Cannot read property \'map\' of undefined\n```\nCode:\n```js\nconst items = data.items.map(i => i.name)\n```',
    explanation: 'Provides error message and relevant code. No unnecessary explanation.'
  },
  {
    title: 'Bad: Vague Problem Description',
    type: 'bad',
    prompt: 'So basically I am having this really weird issue with my code and I am not really sure what is going on. I keep getting this error that says something about TypeError and it mentions something about map and undefined. I think it might be related to this part of my code where I am trying to use map on some data, but I am not entirely sure. The code looks something like const items = data.items.map(i => i.name) but I could be wrong. Can you help me figure out what is wrong?',
    explanation: 'Vague language ("something about", "I think", "basically") and poor formatting make it harder to understand the actual problem.'
  }
];
