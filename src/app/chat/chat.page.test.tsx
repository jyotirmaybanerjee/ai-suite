import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MultiModelChat from './page';

// Jest will automatically use the mocks from the __mocks__ directory

describe('MultiModelChat Page', () => {
  test('should display a new user message and an AI response after sending a message', async () => {
    render(<MultiModelChat />);

    const userInput = 'Hello, AI!';
    
    // Find the input and send button
    const inputElement = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    // Simulate user typing and clicking the send button
    fireEvent.change(inputElement, { target: { value: userInput } });
    fireEvent.click(sendButton);

    // Expect the user's message to appear on the screen immediately
    await waitFor(() => {
        expect(screen.getByText(userInput)).toBeInTheDocument();
    });
    
    // Expect the "Thinking..." message to be displayed
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    
    // Wait for the mocked AI response to appear
    await waitFor(() => {
      const aiResponse = screen.getByText('Mocked AI response.');
      expect(aiResponse).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Expect the thinking message to be hidden
    expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
  });
});