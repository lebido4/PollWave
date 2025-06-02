import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PollCard from './PollCard';
import { AuthProvider } from '../../contexts/AuthContext';

const mockPoll = {
  id: '1',
  title: 'Test Poll',
  description: 'Test Description',
  options: [
    { text: 'Option 1', votes: 5 },
    { text: 'Option 2', votes: 3 }
  ],
  createdAt: '2024-02-20T10:00:00Z',
  endDate: '2025-02-20T10:00:00Z',
  isPublic: true,
  allowComments: true
};

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('PollCard Component', () => {
  it('renders poll information correctly', () => {
    renderWithRouter(<PollCard poll={mockPoll} />);
    
    expect(screen.getByText('Test Poll')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('8 votes')).toBeInTheDocument();
  });

  it('shows active status for ongoing polls', () => {
    renderWithRouter(<PollCard poll={mockPoll} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows correct leading option', () => {
    renderWithRouter(<PollCard poll={mockPoll} />);
    expect(screen.getByText('Лидирует: Option 1')).toBeInTheDocument();
    expect(screen.getByText('62%')).toBeInTheDocument();
  });

  it('handles share button click', () => {
    const mockClipboard = {
      writeText: jest.fn()
    };
    Object.assign(navigator, {
      clipboard: mockClipboard
    });
    
    renderWithRouter(<PollCard poll={mockPoll} />);
    fireEvent.click(screen.getByTitle('Share Poll'));
    expect(mockClipboard.writeText).toHaveBeenCalled();
  });
});