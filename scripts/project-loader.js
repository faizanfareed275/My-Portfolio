// Project Loader - Dynamically loads and displays projects from JSON

class ProjectLoader {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.projectsGrid = document.getElementById('projectsGrid');
        this.projectsLoading = document.getElementById('projectsLoading');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        this.init();
    }
    
    async init() {
        await this.loadProjects();
        this.setupFilters();
        this.renderProjects();
    }
    
    async loadProjects() {
        try {
            // First priority: Load from JSON file
            console.log('Attempting to load projects from ./data/projects.json');
            const response = await fetch('./data/projects.json');
            console.log('Response status:', response.status, response.statusText);
            
            if (response.ok) {
                const projectsData = await response.json();
                console.log('Successfully loaded projects:', projectsData.length, 'projects');
                this.projects = projectsData;
            } else {
                console.warn('Failed to load JSON file, trying localStorage...');
                // Second priority: Try localStorage (for admin-added projects)
                const localProjects = localStorage.getItem('portfolioProjects');
                if (localProjects) {
                    const parsedProjects = JSON.parse(localProjects);
                    console.log('Loaded from localStorage:', parsedProjects.length, 'projects');
                    this.projects = parsedProjects;
                } else {
                    console.warn('No localStorage data, using default projects');
                    // Last resort: Use default projects
                    this.projects = this.getDefaultProjects();
                }
            }
            
            this.filteredProjects = [...this.projects];
            this.hideLoading();
            // Notify listeners that projects finished loading
            window.dispatchEvent(new CustomEvent('projects:loaded', { detail: { count: this.projects.length } }));
        } catch (error) {
            console.error('Error loading projects:', error);
            // On error, try localStorage as backup
            const localProjects = localStorage.getItem('portfolioProjects');
            if (localProjects) {
                try {
                    this.projects = JSON.parse(localProjects);
                    console.log('Fallback: Loaded from localStorage:', this.projects.length, 'projects');
                } catch (parseError) {
                    console.error('Error parsing localStorage projects:', parseError);
                    this.projects = this.getDefaultProjects();
                    console.log('Fallback: Using default projects:', this.projects.length, 'projects');
                }
            } else {
                this.projects = this.getDefaultProjects();
                console.log('Fallback: Using default projects:', this.projects.length, 'projects');
            }
            this.filteredProjects = [...this.projects];
            this.hideLoading();
            window.dispatchEvent(new CustomEvent('projects:loaded', { detail: { count: this.projects.length, error: true } }));
        }
    }
    
    getDefaultProjects() {
        // Temporary fallback - should not be used if JSON loads properly
        console.warn('Using getDefaultProjects() - this means JSON loading failed');
        return [
            {
                id: 1,
                title: "Sample Project",
                description: "This is a fallback project - JSON loading failed",
                technologies: ["HTML", "CSS", "JavaScript"],
                category: "web",
                image: "./assets/images/placeholder.jpg",
                github: "#",
                demo: "#",
                featured: false
            }
        ];
    }
    
    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active filter button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter projects
                this.currentFilter = e.target.getAttribute('data-filter');
                this.filterProjects();
                this.renderProjects();
            });
        });
    }
    
    filterProjects() {
        if (this.currentFilter === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                project.category === this.currentFilter
            );
        }
    }
    
    renderProjects() {
        if (!this.projectsGrid) return;
        
        // Clear existing projects
        this.projectsGrid.innerHTML = '';
        
        // Render filtered projects
        this.filteredProjects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            this.projectsGrid.appendChild(projectCard);
        });
        
        // Trigger animations
        setTimeout(() => {
            const cards = this.projectsGrid.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('show');
                }, index * 100);
            });
        }, 100);
    }
    
    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        
        const techTags = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        const githubLink = project.github ? 
            `<a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i>
                Code
            </a>` : '';
        
        const demoLink = project.demo ? 
            `<a href="${project.demo}" class="project-link" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-external-link-alt"></i>
                Demo
            </a>` : '';
        
        card.innerHTML = `
            <figure class="card-media">
                <img src="${project.image}" alt="${project.title} screenshot" class="project-image" loading="lazy"
                     style="display: none;">
                <div class="project-image-placeholder" data-category="${project.category}">
                    <i class="fas ${this.getCategoryIcon(project.category)}"></i>
                    <span class="placeholder-text">${project.title}</span>
                </div>
                <div class="card-overlay"></div>
            </figure>
            <div class="card-body">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech" aria-label="Technologies used">
                    ${techTags}
                </div>
                <div class="card-actions" aria-label="Project links">
                    ${project.github ? `<a class="icon-btn" href="${project.github}" target="_blank" rel="noopener noreferrer" title="View code on GitHub" aria-label="View code on GitHub"><i class="fab fa-github"></i></a>` : ''}
                    ${project.demo ? `<a class="icon-btn" href="${project.demo}" target="_blank" rel="noopener noreferrer" title="Open live demo" aria-label="Open live demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>
        `;
        
        // Handle image loading with fallback to placeholder
        const img = card.querySelector('.project-image');
        const placeholder = card.querySelector('.project-image-placeholder');
        
        img.onload = function() {
            // Image loaded successfully, show it and hide placeholder
            img.style.display = 'block';
            placeholder.style.display = 'none';
        };
        
        img.onerror = function() {
            // Image failed to load, keep placeholder visible
            img.style.display = 'none';
            placeholder.style.display = 'flex';
        };
        
        // Add click event for project preview modal (optional enhancement)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-actions')) {
                this.showProjectModal(project);
            }
        });
        
        return card;
    }
    
    showProjectModal(project) {
        // Create and show project modal (optional feature)
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${project.image}" alt="${project.title}" class="modal-image">
                    <p>${project.description}</p>
                    <div class="modal-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="modal-links">
                        ${project.github ? `<a href="${project.github}" class="btn btn-primary" target="_blank">View Code</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" class="btn btn-secondary" target="_blank">Live Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        const closeModal = () => {
            modal.remove();
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }
    
    getCategoryIcon(category) {
        const icons = {
            'web': 'fa-globe',
            'mobile': 'fa-mobile-alt',
            'api': 'fa-server',
            'desktop': 'fa-desktop'
        };
        return icons[category] || 'fa-code';
    }
    
    hideLoading() {
        if (this.projectsLoading) {
            this.projectsLoading.style.display = 'none';
        }
    }
    
    // Method to add new project (called from admin panel)
    addProject(projectData) {
        const newProject = {
            id: Date.now(),
            ...projectData,
            featured: false
        };
        
        this.projects.unshift(newProject);
        this.saveProjectsToStorage();
        this.filterProjects();
        this.renderProjects();
        window.dispatchEvent(new CustomEvent('projects:changed', { detail: { type: 'add', id: newProject.id } }));
        
        return newProject;
    }
    
    // Method to update an existing project by id
    updateProject(id, updates) {
        const index = this.projects.findIndex(p => String(p.id) === String(id));
        if (index === -1) return null;
        const updated = { ...this.projects[index], ...updates, id: this.projects[index].id };
        this.projects[index] = updated;
        this.saveProjectsToStorage();
        this.filterProjects();
        this.renderProjects();
        window.dispatchEvent(new CustomEvent('projects:changed', { detail: { type: 'update', id: updated.id } }));
        return updated;
    }

    // Method to delete a project by id
    deleteProject(id) {
        const before = this.projects.length;
        this.projects = this.projects.filter(p => String(p.id) !== String(id));
        const changed = this.projects.length !== before;
        if (changed) {
            this.saveProjectsToStorage();
            this.filterProjects();
            this.renderProjects();
            window.dispatchEvent(new CustomEvent('projects:changed', { detail: { type: 'delete', id } }));
        }
        return changed;
    }

    // Replace projects list entirely (useful for bulk operations)
    replaceProjects(projects) {
        this.projects = Array.isArray(projects) ? projects : [];
        this.saveProjectsToStorage();
        this.filterProjects();
        this.renderProjects();
        window.dispatchEvent(new CustomEvent('projects:changed', { detail: { type: 'replace', count: this.projects.length } }));
    }
    
    // Method to save projects to localStorage
    saveProjectsToStorage() {
        localStorage.setItem('portfolioProjects', JSON.stringify(this.projects));
    }
    
    // Method to export projects as JSON
    exportProjects() {
        const dataStr = JSON.stringify(this.projects, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'projects.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
    
    // Method to get all projects
    getAllProjects() {
        return this.projects;
    }
    
    // Method to search projects
    searchProjects(query) {
        const searchTerm = query.toLowerCase();
        return this.projects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        );
    }
}

// Initialize project loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.projectLoader = new ProjectLoader();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectLoader;
}
