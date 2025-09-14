// Navigation System for EDU-MORPH
class NavigationSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.userRole = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    checkAuthStatus() {
        // Check localStorage for user data
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                this.currentUser = user;
                this.isLoggedIn = true;
                this.userRole = user.role || 'student';
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.clearAuth();
            }
        }
    }

    setupEventListeners() {
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'user') {
                this.checkAuthStatus();
                this.updateNavigation();
            }
        });

        // Listen for custom auth events
        window.addEventListener('userLogin', () => {
            this.checkAuthStatus();
            this.updateNavigation();
        });

        window.addEventListener('userLogout', () => {
            this.clearAuth();
            this.updateNavigation();
        });
    }

    clearAuth() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.userRole = null;
        localStorage.removeItem('user');
    }

    updateNavigation() {
        // Update navigation elements across all pages
        this.updateNavbar();
        this.updateSidebar();
        this.updateBreadcrumbs();
    }

    updateNavbar() {
        const navbar = document.querySelector('[data-navbar]');
        if (!navbar) return;

        const userSection = navbar.querySelector('[data-user-section]');
        const authSection = navbar.querySelector('[data-auth-section]');
        const mobileUserSection = navbar.querySelector('[data-mobile-user-section]');
        const mobileAuthSection = navbar.querySelector('[data-mobile-auth-section]');

        if (this.isLoggedIn) {
            if (userSection) userSection.style.display = 'flex';
            if (authSection) authSection.style.display = 'none';
            if (mobileUserSection) mobileUserSection.style.display = 'block';
            if (mobileAuthSection) mobileAuthSection.style.display = 'none';
            this.updateUserInfo(userSection);
            this.updateUserInfo(mobileUserSection);
        } else {
            if (userSection) userSection.style.display = 'none';
            if (authSection) authSection.style.display = 'flex';
            if (mobileUserSection) mobileUserSection.style.display = 'none';
            if (mobileAuthSection) mobileAuthSection.style.display = 'block';
        }
    }

    updateUserInfo(userSection) {
        if (!userSection || !this.currentUser) return;

        const userName = userSection.querySelector('[data-user-name]');
        const userInitials = userSection.querySelector('[data-user-initials]');
        const userRole = userSection.querySelector('[data-user-role]');
        const mobileUserName = userSection.querySelector('[data-mobile-user-name]');
        const mobileUserInitials = userSection.querySelector('[data-mobile-user-initials]');
        const mobileUserRole = userSection.querySelector('[data-mobile-user-role]');

        const displayName = this.currentUser.name || 
                           `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim() || 
                           this.currentUser.email || 
                           'User';
        const initials = this.getInitials(displayName);
        const role = this.userRole ? this.userRole.charAt(0).toUpperCase() + this.userRole.slice(1) : 'Student';

        // Update desktop elements
        if (userName) userName.textContent = displayName;
        if (userInitials) userInitials.textContent = initials;
        if (userRole) userRole.textContent = role;

        // Update mobile elements
        if (mobileUserName) mobileUserName.textContent = displayName;
        if (mobileUserInitials) mobileUserInitials.textContent = initials;
        if (mobileUserRole) mobileUserRole.textContent = role;
    }

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    updateSidebar() {
        const sidebar = document.querySelector('[data-sidebar]');
        if (!sidebar) return;

        // Show/hide role-specific menu items
        const studentItems = sidebar.querySelectorAll('[data-student-only]');
        const educatorItems = sidebar.querySelectorAll('[data-educator-only]');

        if (this.userRole === 'student') {
            studentItems.forEach(item => item.style.display = 'block');
            educatorItems.forEach(item => item.style.display = 'none');
        } else if (this.userRole === 'educator') {
            studentItems.forEach(item => item.style.display = 'none');
            educatorItems.forEach(item => item.style.display = 'block');
        } else {
            studentItems.forEach(item => item.style.display = 'none');
            educatorItems.forEach(item => item.style.display = 'none');
        }
    }

    updateBreadcrumbs() {
        const breadcrumbs = document.querySelector('[data-breadcrumbs]');
        if (!breadcrumbs) return;

        const currentPage = this.getCurrentPage();
        const breadcrumbItems = this.generateBreadcrumbs(currentPage);
        
        breadcrumbs.innerHTML = breadcrumbItems.map(item => 
            `<li class="breadcrumb-item ${item.active ? 'active' : ''}">
                ${item.active ? item.name : `<a href="${item.url}">${item.name}</a>`}
            </li>`
        ).join('');
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        
        const pageMap = {
            'index': 'Home',
            'login-simple': 'Login',
            'signup-final': 'Sign Up',
            'dashboard-simple': 'Dashboard',
            'document-ai-generator': 'Document AI Generator',
            'document-ai-optimized': 'Document AI (Optimized)',
            'test-document-ai': 'Test Document AI',
            'test-chatbot': 'Test Chatbot',
            'test-database': 'Test Database',
            'test-login': 'Test Login',
            'test-resource-upload': 'Test Resource Upload',
            'test-student-modules': 'Test Student Modules',
            'test-students': 'Test Students',
            'test-supabase': 'Test Supabase',
            'test-user-data': 'Test User Data',
            'setup-database': 'Setup Database'
        };

        return {
            id: page,
            name: pageMap[page] || page.charAt(0).toUpperCase() + page.slice(1),
            url: window.location.pathname
        };
    }

    generateBreadcrumbs(currentPage) {
        const breadcrumbs = [
            { name: 'Home', url: 'index.html', active: false }
        ];

        if (currentPage.id !== 'index') {
            if (this.isLoggedIn) {
                breadcrumbs.push({ name: 'Dashboard', url: 'dashboard-simple.html', active: false });
            }

            if (currentPage.id.includes('document-ai')) {
                breadcrumbs.push({ name: 'Document AI', url: 'document-ai-generator.html', active: false });
            }

            if (currentPage.id.includes('test-')) {
                breadcrumbs.push({ name: 'Testing', url: '#', active: false });
            }

            breadcrumbs.push({ ...currentPage, active: true });
        } else {
            breadcrumbs[0].active = true;
        }

        return breadcrumbs;
    }

    // Navigation methods
    navigateTo(url) {
        window.location.href = url;
    }

    goBack() {
        window.history.back();
    }

    goHome() {
        this.navigateTo('index.html');
    }

    goToDashboard() {
        if (this.isLoggedIn) {
            this.navigateTo('dashboard-simple.html');
        } else {
            this.navigateTo('login-simple.html');
        }
    }

    goToDocumentAI() {
        if (this.isLoggedIn) {
            this.navigateTo('document-ai-generator.html');
        } else {
            this.navigateTo('login-simple.html');
        }
    }

    logout() {
        this.clearAuth();
        window.dispatchEvent(new CustomEvent('userLogout'));
        this.navigateTo('index.html');
    }

    // Get navigation menu items based on user role
    getNavigationItems() {
        const baseItems = [
            { name: 'Home', url: 'index.html', icon: '🏠', public: true },
            { name: 'About', url: '#about', icon: 'ℹ️', public: true },
            { name: 'AI Chatbot', url: 'advanced-chatbot-interface.html', icon: '🤖', public: true }
        ];

        if (this.isLoggedIn) {
            const userItems = [
                { name: 'Dashboard', url: 'dashboard-simple.html', icon: '📊', role: 'both' },
                { name: 'AI Chatbot', url: 'advanced-chatbot-interface.html', icon: '🤖', role: 'both' },
                { name: 'Document AI', url: 'document-ai-generator.html', icon: '📄', role: 'both' },
                { name: 'Profile', url: '#profile', icon: '👤', role: 'both' }
            ];

            if (this.userRole === 'educator') {
                userItems.push(
                    { name: 'Test Creator', url: 'ai-test-creator.html', icon: '📝', role: 'educator' },
                    { name: 'Analytics Dashboard', url: 'teacher-analytics-dashboard.html', icon: '📊', role: 'educator' },
                    { name: 'Student Management', url: '#students', icon: '👥', role: 'educator' },
                    { name: 'Content Library', url: '#library', icon: '📚', role: 'educator' }
                );
            }

            if (this.userRole === 'student') {
                userItems.push(
                    { name: 'My Learning', url: '#learning', icon: '📖', role: 'student' },
                    { name: 'Assignments', url: '#assignments', icon: '📝', role: 'student' },
                    { name: 'Progress', url: '#progress', icon: '📊', role: 'student' }
                );
            }

            return [...baseItems, ...userItems];
        } else {
            return [
                ...baseItems,
                { name: 'Login', url: 'login-simple.html', icon: '🔑', public: true },
                { name: 'Sign Up', url: 'signup-final.html', icon: '✍️', public: true }
            ];
        }
    }

    // Generate navigation HTML
    generateNavigationHTML() {
        const items = this.getNavigationItems();
        
        return `
            <nav class="bg-white shadow-sm border-b border-gray-100" data-navbar>
                <div class="max-w-7xl mx-auto px-6">
                    <div class="flex justify-between items-center h-20">
                        <!-- Logo Section -->
                        <div class="flex items-center space-x-4">
                            <a href="index.html" class="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300">
                                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span class="text-white font-bold text-lg">EM</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-2xl font-bold text-gray-900 leading-tight">EDU-MORPH</span>
                                </div>
                            </a>
                        </div>

                        <!-- Desktop Navigation -->
                        <div class="hidden lg:flex items-center space-x-1">
                            ${items.map(item => 
                                `<a href="${item.url}" class="flex flex-col items-center px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                                    <div class="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">${item.icon}</div>
                                    <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">${item.name}</span>
                                </a>`
                            ).join('')}
                        </div>

                        <!-- User Section (Logged In) -->
                        <div class="hidden lg:flex items-center space-x-4" data-user-section style="display: none;">
                            <div class="relative">
                                <button onclick="navigation.toggleUserMenu()" class="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span class="text-white font-bold text-sm" data-user-initials>U</span>
                                    </div>
                                    <div class="flex flex-col items-start">
                                        <span class="text-sm font-semibold text-gray-900" data-user-name>User</span>
                                        <span class="text-xs text-gray-500" data-user-role>Student</span>
                                    </div>
                                    <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <!-- User Dropdown -->
                                <div id="userMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden" style="display: none;">
                                    <div class="py-2">
                                        <a href="dashboard-simple.html" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                            <span class="text-lg mr-3">📊</span>
                                            <span>Dashboard</span>
                                        </a>
                                        <a href="#profile" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                            <span class="text-lg mr-3">👤</span>
                                            <span>Profile</span>
                                        </a>
                                        <a href="#settings" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                            <span class="text-lg mr-3">⚙️</span>
                                            <span>Settings</span>
                                        </a>
                                        <hr class="my-2 border-gray-100">
                                        <button onclick="navigation.logout()" class="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200">
                                            <span class="text-lg mr-3">🚪</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Auth Section (Not Logged In) -->
                        <div class="hidden md:flex items-center space-x-4" data-auth-section>
                            <a href="login-simple.html" class="text-gray-600 hover:text-gray-900">Login</a>
                            <a href="signup-final.html" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">Sign Up</a>
                        </div>

                        <!-- Mobile Menu Button -->
                        <div class="lg:hidden">
                            <button onclick="navigation.toggleMobileMenu()" class="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Mobile Menu -->
                    <div id="mobileMenu" class="lg:hidden bg-gray-50 border-t border-gray-100" style="display: none;">
                        <div class="px-4 py-6 space-y-2">
                            ${items.map(item => 
                                `<a href="${item.url}" class="flex items-center px-4 py-3 text-gray-700 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-200 group">
                                    <span class="text-2xl mr-4 group-hover:scale-110 transition-transform duration-200">${item.icon}</span>
                                    <span class="font-medium">${item.name}</span>
                                </a>`
                            ).join('')}
                            
                            <!-- Mobile User Section -->
                            <div class="pt-4 border-t border-gray-200" data-mobile-user-section style="display: none;">
                                <div class="px-4 py-3 bg-white rounded-xl shadow-sm">
                                    <div class="flex items-center space-x-3 mb-3">
                                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span class="text-white font-bold text-sm" data-mobile-user-initials>U</span>
                                        </div>
                                        <div>
                                            <div class="font-semibold text-gray-900" data-mobile-user-name>User</div>
                                            <div class="text-sm text-gray-500" data-mobile-user-role>Student</div>
                                        </div>
                                    </div>
                                    <div class="space-y-1">
                                        <a href="dashboard-simple.html" class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                            <span class="text-lg mr-3">📊</span>
                                            <span>Dashboard</span>
                                        </a>
                                        <a href="#profile" class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                            <span class="text-lg mr-3">👤</span>
                                            <span>Profile</span>
                                        </a>
                                        <button onclick="navigation.logout()" class="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                                            <span class="text-lg mr-3">🚪</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Mobile Auth Section -->
                            <div class="pt-4 border-t border-gray-200" data-mobile-auth-section>
                                <div class="space-y-2">
                                    <a href="login-simple.html" class="block px-4 py-3 text-center text-gray-700 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-200">
                                        Login
                                    </a>
                                    <a href="signup-final.html" class="block px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                                        Sign Up
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    // Toggle methods
    toggleUserMenu() {
        const menu = document.getElementById('userMenu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    }

    toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Initialize navigation on page load
    initialize() {
        this.updateNavigation();
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('[data-user-section]')) {
                const userMenu = document.getElementById('userMenu');
                if (userMenu) userMenu.style.display = 'none';
            }
        });
    }
}

// Global navigation instance
window.navigation = new NavigationSystem();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation.initialize();
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationSystem;
}
