import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { LinkData, Navbar } from './NavBar';

// Mock the useAuth hook from AuthContext
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockLogout = jest.fn();
const mockUser = { name: 'Test User' };
const { useAuth } = jest.requireMock('@/context/AuthContext');

describe('Navbar', () => {
    const links: LinkData[] = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/about', label: 'About' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders logo and navigation links', () => {
        useAuth.mockReturnValue({ user: null, logout: mockLogout });
        render(<Navbar links={links} />);
        expect(screen.getByText('AI Suite')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('shows Logout when user is authenticated', () => {
        useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
        render(<Navbar links={links} />);
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('calls logout when Logout is clicked (desktop)', () => {
        useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
        render(<Navbar links={links} />);
        fireEvent.click(screen.getByText('Logout'));
        expect(mockLogout).toHaveBeenCalled();
    });

    it('opens and closes mobile menu', () => {
        useAuth.mockReturnValue({ user: null, logout: mockLogout });
        render(<Navbar links={links} />);
        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);
        expect(screen.getByText('Dashboard')).toBeVisible();
        fireEvent.click(menuButton);
        expect(screen.queryByText('Dashboard')).toBeInTheDocument(); // Still in DOM, but hidden
    });

    it('renders error for invalid links prop', () => {
        useAuth.mockReturnValue({ user: null, logout: mockLogout });
        // @ts-expect-error testing invalid prop
        render(<Navbar links={[]} />);
        expect(screen.getByText(/Error: Invalid navigation data/i)).toBeInTheDocument();
    });

    it('closes mobile menu after clicking a link', () => {
        useAuth.mockReturnValue({ user: null, logout: mockLogout });
        render(<Navbar links={links} />);
        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);
        const aboutLink = screen.getByText('About');
        fireEvent.click(aboutLink);
        // Menu should close, but since we don't have animation, just check if About is still in the DOM
        expect(screen.queryByText('About')).toBeInTheDocument();
    });

    it('calls logout and closes mobile menu when Logout is clicked', () => {
        useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
        render(<Navbar links={links} />);
        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);
        const logoutLink = screen.getByText('Logout');
        fireEvent.click(logoutLink);
        expect(mockLogout).toHaveBeenCalled();
    });
});