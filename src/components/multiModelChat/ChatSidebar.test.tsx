import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import ChatSidebar from './ChatSidebar';

describe('ChatSidebar', () => {
    const chats = [
        { id: '1', title: 'Chat One', createdAt: 1710000000000 },
        { id: '2', title: 'Chat Two', createdAt: 1710000001000 },
    ];
    const onSelectChat = jest.fn();
    const onNewChat = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the sidebar with chats and new conversation button', () => {
        render(
            <ChatSidebar
                chats={chats}
                onSelectChat={onSelectChat}
                currentChatId={null}
                onNewChat={onNewChat}
            />
        );
        expect(screen.getByText('Chats')).toBeInTheDocument();
        expect(screen.getByText('New Conversation')).toBeInTheDocument();
        expect(screen.getByText('Chat One')).toBeInTheDocument();
        expect(screen.getByText('Chat Two')).toBeInTheDocument();
    });

    it('calls onNewChat when the new conversation button is clicked', () => {
        render(
            <ChatSidebar
                chats={chats}
                onSelectChat={onSelectChat}
                currentChatId={null}
                onNewChat={onNewChat}
            />
        );
        fireEvent.click(screen.getByText('New Conversation'));
        expect(onNewChat).toHaveBeenCalledTimes(1);
    });

    it('calls onSelectChat with the correct id when a chat is clicked', () => {
        render(
            <ChatSidebar
                chats={chats}
                onSelectChat={onSelectChat}
                currentChatId={null}
                onNewChat={onNewChat}
            />
        );
        fireEvent.click(screen.getByText('Chat Two'));
        expect(onSelectChat).toHaveBeenCalledWith('2');
    });

    it('highlights the currently selected chat', () => {
        render(
            <ChatSidebar
                chats={chats}
                onSelectChat={onSelectChat}
                currentChatId="1"
                onNewChat={onNewChat}
            />
        );
        const chatOne = screen.getByText('Chat One');
        expect(chatOne).toHaveClass('bg-gray-700');
        const chatTwo = screen.getByText('Chat Two');
        expect(chatTwo).not.toHaveClass('bg-gray-700');
    });

    it('renders no chats if the chats array is empty', () => {
        render(
            <ChatSidebar
                chats={[]}
                onSelectChat={onSelectChat}
                currentChatId={null}
                onNewChat={onNewChat}
            />
        );
        expect(screen.queryByText('Chat One')).not.toBeInTheDocument();
        expect(screen.queryByText('Chat Two')).not.toBeInTheDocument();
    });
});