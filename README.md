# Subscription Manager

A beautiful, modern subscription tracking website built with the Landio design system featuring dark theme and glassmorphism effects.

## Features

- **Track Subscriptions**: Add, view, and delete your recurring subscriptions
- **Cost Analytics**: Real-time calculation of monthly and yearly costs
- **Category Breakdown**: Organize subscriptions by category (Entertainment, Productivity, Software, etc.)
- **Upcoming Payments**: Never miss a payment with the upcoming payments tracker
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Local Storage**: All data is saved locally in your browser
- **Modern UI**: Dark theme with glassmorphism effects, inspired by Landio template

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with variables, glassmorphism, and responsive design
- **Vanilla JavaScript**: No frameworks, pure JS for functionality
- **LocalStorage API**: Client-side data persistence

## Design Features

- Dark background (`#04070d`)
- Glassmorphism with backdrop blur effects
- Gradient accents (`#a6daff` to `#6b9cff`)
- Inter font family
- Smooth animations and transitions
- Mobile-first responsive design

## Getting Started

1. Open `app.html` in your web browser
2. Click "Add New" to add your first subscription
3. Fill in the subscription details:
   - Service Name
   - Cost
   - Billing Cycle (Monthly, Yearly, Weekly)
   - Category
   - Next Payment Date
4. View your analytics and upcoming payments

## File Structure

```
subscription-manager/
├── app.html       # Main HTML file
├── styles.css     # All styles with Landio design system
├── script.js      # Subscription management logic
└── README.md      # This file
```

## Demo Data

The app comes with 3 demo subscriptions:
- Netflix ($15.99/month)
- Spotify ($9.99/month)
- Adobe Creative Cloud ($54.99/month)

You can delete these and add your own subscriptions.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --color-accent: #a6daff;
    --color-bg-primary: #04070d;
    /* ... more variables */
}
```

### Categories
Add more categories in `app.html` line 127-135:
```html
<option value="your-category">Your Category</option>
```

## Future Enhancements

- Export data to CSV
- Import subscriptions
- Email reminders
- Chart.js integration for visual analytics
- Multi-currency support
- Dark/Light theme toggle
- Subscription sharing between devices

## License

Free to use for personal and commercial projects.

## Credits

Design inspired by Landio - AI Agency & Landing Page Template (Framer)
