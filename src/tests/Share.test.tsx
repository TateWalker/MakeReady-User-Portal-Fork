import React from 'react';
import { render, screen } from '@testing-library/react';
import Share from '../pages/Share';

test('renders learn react link', () => {
    render(<Share />);
    const linkElement = screen.getByText(/Share/i);
    expect(linkElement).toBeInTheDocument();
});
