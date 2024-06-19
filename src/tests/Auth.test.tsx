import React from 'react';
import { render, screen } from '@testing-library/react';
import Auth from '../pages/Auth';

test('renders learn react link', () => {
    render(<Auth />);
    const linkElement = screen.getByText(/Login/i);
    expect(linkElement).toBeInTheDocument();
});
