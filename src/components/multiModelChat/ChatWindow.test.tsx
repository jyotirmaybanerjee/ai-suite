import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import ChatWindow from './ChatWindow';

describe('ChatWindow', () => {
    const mockMessages = [
        {
            id: '1',
            sender: 'user',
            text: 'Hello AI!',
            createdAt: 1,
        },
        {
            id: '2',
            sender: 'ai',
            text: 'Hello user!',
            createdAt: 2,
        },
    ];

    const mockSetUserInput = jest.fn();
    const mockHandleSendMessage = jest.fn((e) => {
        e.preventDefault();
        return Promise.resolve();
    });
    const mockHandleSelectModel = jest.fn();
    const models = ['gpt-3', 'gpt-4'];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders messages', () => {
        render(
            <ChatWindow
                messages={mockMessages}
                isLoading={false}
                userInput=""
                setUserInput={mockSetUserInput}
                handleSendMessage={mockHandleSendMessage}
                selectedModel="gpt-3"
                handleSelectModel={mockHandleSelectModel}
                models={models}
            />
        );
        expect(screen.getByText('Hello AI!')).toBeInTheDocument();
        expect(screen.getByText('Hello user!')).toBeInTheDocument();
    });

    it('renders model selection and calls handleSelectModel on change', () => {
        render(
            <ChatWindow
                messages={mockMessages}
                isLoading={false}
                userInput=""
                setUserInput={mockSetUserInput}
                handleSendMessage={mockHandleSendMessage}
                selectedModel="gpt-3"
                handleSelectModel={mockHandleSelectModel}
                models={models}
            />
        );
        const select = screen.getByLabelText(/select model/i);
        fireEvent.change(select, { target: { value: 'gpt-4' } });
        expect(mockHandleSelectModel).toHaveBeenCalled();
    });

    it('shows loading indicator when isLoading is true', () => {
        render(
            <ChatWindow
                messages={mockMessages}
                isLoading={true}
                userInput=""
                setUserInput={mockSetUserInput}
                handleSendMessage={mockHandleSendMessage}
                selectedModel="gpt-3"
                handleSelectModel={mockHandleSelectModel}
                models={models}
            />
        );
        expect(screen.getByText(/thinking/i)).toBeInTheDocument();
    });

    it('calls setUserInput on input change', () => {
        render(
            <ChatWindow
                messages={mockMessages}
                isLoading={false}
                userInput=""
                setUserInput={mockSetUserInput}
                handleSendMessage={mockHandleSendMessage}
                selectedModel="gpt-3"
                handleSelectModel={mockHandleSelectModel}
                models={models}
            />
        );
        const input = screen.getByPlaceholderText(/type your message/i);
        fireEvent.change(input, { target: { value: 'Test message' } });
        expect(mockSetUserInput).toHaveBeenCalledWith('Test message');
    });

    it('calls handleSendMessage on form submit', () => {
        render(
            <ChatWindow
                messages={mockMessages}
                isLoading={false}
                userInput="Test"
                setUserInput={mockSetUserInput}
                handleSendMessage={mockHandleSendMessage}
                selectedModel="gpt-3"
                handleSelectModel={mockHandleSelectModel}
                models={models}
            />
        );
        const form = screen.getByRole('form') || screen.getByRole('textbox').closest('form');
        fireEvent.submit(form!);
        expect(mockHandleSendMessage).toHaveBeenCalled();
    });

    it('disables input and button when isLoading is true', () => {
        render(
            <ChatWindow
                messages={mockMessages}
                isLoading={true}
                userInput=""
                setUserInput={mockSetUserInput}
                handleSendMessage={mockHandleSendMessage}
                selectedModel="gpt-3"
                handleSelectModel={mockHandleSelectModel}
                models={models}
            />
        );
        expect(screen.getByPlaceholderText(/type your message/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    });
});