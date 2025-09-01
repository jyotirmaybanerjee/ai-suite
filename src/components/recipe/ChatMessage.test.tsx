import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import ChatMessage from './ChatMessage';

describe('ChatMessage', () => {
    it('renders user message with correct styles and alignment', () => {
        render(<ChatMessage sender="user" text="Hello from user" />);
        const message = screen.getByText('Hello from user');
        expect(message).toBeInTheDocument();
        expect(message).toHaveClass('bg-blue-500');
        expect(message).toHaveClass('text-white');
        // Check alignment
        expect(message.parentElement).toHaveClass('justify-end');
    });

    it('renders ai message with correct styles and alignment', () => {
        render(<ChatMessage sender="ai" text="Hello from AI" />);
        const message = screen.getByText('Hello from AI');
        expect(message).toBeInTheDocument();
        expect(message).toHaveClass('bg-gray-300');
        expect(message).toHaveClass('text-gray-800');
        // Check alignment
        expect(message.parentElement).toHaveClass('justify-start');
    });

    it('renders the provided text', () => {
        const testText = 'Test message content';
        render(<ChatMessage sender="user" text={testText} />);
        expect(screen.getByText(testText)).toBeInTheDocument();
    });
});