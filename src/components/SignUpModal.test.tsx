import { useAuth } from '@/context/AuthContext';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignUpModal from './SignUpModal';

jest.mock('@/context/AuthContext');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('SignUpModal', () => {
    const mockSignupWithEmail = jest.fn();
    const mockOnClose = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            signupWithEmail: mockSignupWithEmail,
        });
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
        mockSignupWithEmail.mockReset();
        mockOnClose.mockReset();
        mockPush.mockReset();
    });

    it('renders modal with form fields and close button', () => {
        render(<SignUpModal onClose={mockOnClose} />);
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password (min 6 chars)')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /✕/ })).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<SignUpModal onClose={mockOnClose} />);
        fireEvent.click(screen.getByRole('button', { name: /✕/ }));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('updates email and password fields on user input', () => {
        render(<SignUpModal onClose={mockOnClose} />);
        const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Password (min 6 chars)') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('submits the form, calls signupWithEmail, onClose, and router.push', async () => {
        mockSignupWithEmail.mockResolvedValue(undefined);
        render(<SignUpModal onClose={mockOnClose} />);
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password (min 6 chars)'), { target: { value: 'secret123' } });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(mockSignupWithEmail).toHaveBeenCalledWith('user@test.com', 'secret123');
            expect(mockOnClose).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });
});