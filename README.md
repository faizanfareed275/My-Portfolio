# 🚀 Dynamic Portfolio Website

A fully responsive, modern, and dynamic personal portfolio website built with HTML5, CSS3, and vanilla JavaScript. Features dynamic content loading, dark/light mode toggle, smooth animations, and an admin panel for content management.

## ✨ Features

### 🎨 Core Features
- **Responsive Design**: Mobile-first approach with seamless adaptation to all screen sizes
- **Dark/Light Mode**: Toggle between themes with localStorage persistence
- **Dynamic Content**: Projects loaded from JSON with real-time filtering
- **Smooth Animations**: AOS library integration with custom scroll effects
- **Typewriter Effect**: Animated hero section tagline
- **Progress Indicators**: Scroll progress bar and animated counters
- **SEO Optimized**: Meta tags, Open Graph, and semantic HTML

### 📱 Sections
1. **Hero Section**: Name, title, typewriter tagline, and CTA buttons
2. **About Section**: Bio, skills showcase, and animated statistics
3. **Projects Section**: Dynamic project cards with filtering and search
4. **Resume Section**: PDF preview and download functionality
5. **Contact Section**: Validated contact form with toast notifications
6. **Footer**: Social links and navigation

### 🔧 Dynamic Features
- **Admin Panel**: Hidden content management system (`?admin=true`)
- **Project Management**: Add, edit, and export projects
- **Form Validation**: Real-time contact form validation
- **Local Storage**: Theme preferences and project data persistence
- **Toast Notifications**: User feedback system
- **Keyboard Shortcuts**: Accessibility and power user features

## 🏗️ Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── favicon.ico             # Website favicon
├── README.md              # Project documentation
├── assets/
│   ├── images/            # Project images and profile photo
│   └── icons/             # Icon assets
├── data/
│   └── projects.json      # Project data file
├── styles/
│   ├── main.css          # Main stylesheet
│   └── themes.css        # Theme-specific styles
├── scripts/
│   ├── main.js           # Core functionality
│   ├── project-loader.js # Dynamic project loading
│   ├── admin-panel.js    # Admin panel functionality
│   └── form-validation.js # Contact form validation
└── resume/
    └── resume.pdf        # Downloadable resume
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Local web server (optional but recommended)

### Installation

1. **Clone or download** this repository
2. **Replace placeholder content** with your information:
   - Update personal information in `index.html`
   - Add your profile photo to `assets/images/profile.jpg`
   - Replace project images in `assets/images/`
   - Add your resume PDF to `resume/resume.pdf`
   - Update social media links and contact information

3. **Customize the content**:
   - Edit projects in `data/projects.json`
   - Modify skills and technologies in the HTML
   - Update color scheme in CSS variables
   - Add your own project screenshots

4. **Serve the website**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

5. **Open in browser**: Navigate to `http://localhost:8000`

## 🎨 Customization

### Colors and Theming
Edit CSS variables in `styles/main.css`:
```css
:root {
    --primary: #3b82f6;        /* Primary brand color */
    --secondary: #64748b;      /* Secondary color */
    --accent: #f59e0b;         /* Accent color */
    /* ... more variables */
}
```

### Adding Projects
Use the admin panel (`?admin=true`) or edit `data/projects.json`:
```json
{
    "id": 1,
    "title": "Project Name",
    "description": "Project description",
    "technologies": ["React", "Node.js"],
    "category": "web",
    "image": "./assets/images/project.jpg",
    "github": "https://github.com/username/repo",
    "demo": "https://demo-url.com",
    "featured": true
}
```

### Personal Information
Update the following in `index.html`:
- Name and title in hero section
- About section bio and statistics
- Contact information
- Social media links
- Meta tags for SEO

## 🔧 Admin Panel

Access the admin panel by adding `?admin=true` to the URL:
- **Add Projects**: Fill out the form to add new projects
- **Export Data**: Download projects as JSON file
- **Real-time Updates**: Changes appear immediately

### Keyboard Shortcuts
- `Ctrl/Cmd + Shift + T`: Toggle theme
- `Ctrl/Cmd + Shift + A`: Toggle admin panel
- `Escape`: Close admin panel

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select source branch (main/master)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Connect your GitHub repository
2. Build settings: Leave empty (static site)
3. Deploy directory: `/` (root)

### Vercel
1. Import your GitHub repository
2. Framework preset: Other
3. Build and output settings: Default

## 🔒 Security Features

- Input sanitization
- XSS protection
- Content Security Policy ready
- Safe external link handling

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion preferences

## 📊 Performance

- Optimized images
- Minimal JavaScript
- CSS Grid and Flexbox
- Lazy loading ready
- Service Worker ready (PWA)

## 🛠️ Development

### Adding New Features
1. Create feature branch
2. Add functionality to appropriate JS file
3. Update CSS if needed
4. Test across browsers
5. Update documentation

### Code Style
- Use ES6+ features
- Follow semantic HTML
- Use CSS custom properties
- Comment complex functionality
- Maintain accessibility standards

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you have questions or need help customizing the portfolio:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

## 🎯 Roadmap

- [ ] Blog integration
- [ ] Multi-language support
- [ ] Advanced animations
- [ ] CMS integration
- [ ] Performance analytics
- [ ] A/B testing framework

---

**Made with ❤️ and vanilla JavaScript**

*Remember to replace all placeholder content with your actual information before deploying!*
