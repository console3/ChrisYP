/**
 * NoCaptcha.io 主 JavaScript 文件
 * 交互功能、动画效果和用户体验优化
 */

(function() {
    'use strict';

    // ===== 全局变量 =====
    let isScrolling = false;
    let currentLanguage = 'zh';
    
    // ===== DOM 元素 =====
    const elements = {
        header: null,
        navToggle: null,
        navMenu: null,
        backToTop: null,
        langBtn: null,
        langMenu: null,
        searchInput: null,
        modals: null,
        tooltips: null
    };

    // ===== 初始化函数 =====
    function init() {
        // 获取 DOM 元素
        getDOMElements();
        
        // 绑定事件监听器
        bindEventListeners();
        
        // 初始化组件
        initComponents();
        
        // 页面加载完成后的处理
        handlePageLoad();
        
        console.log('NoCaptcha.io 网站初始化完成');
    }

    // ===== 获取 DOM 元素 =====
    function getDOMElements() {
        elements.header = document.querySelector('.header');
        elements.navToggle = document.getElementById('nav-toggle');
        elements.navMenu = document.getElementById('nav-menu');
        elements.backToTop = document.getElementById('back-to-top');
        elements.langBtn = document.getElementById('lang-btn');
        elements.langMenu = document.getElementById('lang-menu');
        elements.searchInput = document.querySelector('.search-input');
        elements.modals = document.querySelectorAll('.modal');
        elements.tooltips = document.querySelectorAll('.tooltip');
    }

    // ===== 绑定事件监听器 =====
    function bindEventListeners() {
        // 滚动事件
        window.addEventListener('scroll', throttle(handleScroll, 16));
        
        // 窗口大小改变事件
        window.addEventListener('resize', throttle(handleResize, 250));
        
        // 移动端菜单切换
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleMobileMenu);
        }
        
        // 返回顶部按钮
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', scrollToTop);
        }
        
        // 语言切换
        if (elements.langBtn && elements.langMenu) {
            bindLanguageSwitcher();
        }
        
        // 平滑滚动锚点链接
        bindSmoothScrollLinks();
        
        // 搜索功能
        if (elements.searchInput) {
            bindSearchFunctionality();
        }
        
        // 模态框
        bindModalFunctionality();
        
        // 代码复制功能
        bindCodeCopyFunctionality();
        
        // 表单验证
        bindFormValidation();
    }

    // ===== 初始化组件 =====
    function initComponents() {
        // 初始化动画观察器
        initIntersectionObserver();
        
        // 初始化代码高亮
        initCodeHighlight();
        
        // 初始化图片懒加载
        initLazyLoading();
        
        // 初始化工具提示
        initTooltips();
        
        // 初始化进度条
        initProgressBars();
    }

    // ===== 页面加载处理 =====
    function handlePageLoad() {
        // 移除加载状态
        document.body.classList.remove('loading');
        
        // 添加页面加载完成的类
        document.body.classList.add('loaded');
        
        // 处理 URL 哈希
        handleURLHash();
        
        // 更新活动导航项
        updateActiveNavItem();
    }

    // ===== 滚动处理 =====
    function handleScroll() {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            
            // 更新头部样式
            updateHeaderStyle(scrollY);
            
            // 更新返回顶部按钮
            updateBackToTopButton(scrollY);
            
            // 更新进度条
            updateReadingProgress();
            
            // 更新活动导航项
            updateActiveNavItem();
            
            isScrolling = false;
        });
    }

    // ===== 更新头部样式 =====
    function updateHeaderStyle(scrollY) {
        if (!elements.header) return;
        
        if (scrollY > 100) {
            elements.header.classList.add('scrolled');
        } else {
            elements.header.classList.remove('scrolled');
        }
    }

    // ===== 更新返回顶部按钮 =====
    function updateBackToTopButton(scrollY) {
        if (!elements.backToTop) return;
        
        if (scrollY > 500) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }
    }

    // ===== 更新阅读进度 =====
    function updateReadingProgress() {
        const progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    // ===== 更新活动导航项 =====
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== 窗口大小改变处理 =====
    function handleResize() {
        // 关闭移动端菜单
        if (window.innerWidth > 1024 && elements.navMenu) {
            elements.navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
        
        // 重新计算元素位置
        recalculateElementPositions();
    }

    // ===== 移动端菜单切换 =====
    function toggleMobileMenu() {
        if (!elements.navMenu) return;
        
        elements.navMenu.classList.toggle('active');
        elements.navToggle.classList.toggle('active');
        document.body.classList.toggle('nav-open');
        
        // 切换汉堡菜单动画
        const spans = elements.navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.transform = elements.navToggle.classList.contains('active') 
                ? getHamburgerTransform(index) 
                : '';
        });
    }

    // ===== 汉堡菜单变换 =====
    function getHamburgerTransform(index) {
        const transforms = [
            'rotate(45deg) translate(5px, 5px)',
            'opacity: 0',
            'rotate(-45deg) translate(7px, -6px)'
        ];
        return transforms[index] || '';
    }

    // ===== 返回顶部 =====
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===== 语言切换器 =====
    function bindLanguageSwitcher() {
        const langOptions = elements.langMenu.querySelectorAll('.lang-option');
        
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });
    }

    // ===== 切换语言 =====
    function switchLanguage(lang) {
        currentLanguage = lang;
        
        // 更新当前语言显示
        const currentLangSpan = document.getElementById('current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = lang === 'zh' ? '中文' : 'English';
        }
        
        // 保存语言偏好
        localStorage.setItem('preferred-language', lang);
        
        // 如果有对应的语言页面，则跳转
        if (lang === 'en') {
            // 跳转到英文页面
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/en/')) {
                window.location.href = './en/index.html';
            }
        } else {
            // 跳转到中文页面
            const currentPath = window.location.pathname;
            if (currentPath.includes('/en/')) {
                window.location.href = '../index.html';
            }
        }
    }

    // ===== 平滑滚动锚点链接 =====
    function bindSmoothScrollLinks() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // 更新 URL
                    history.pushState(null, null, href);
                }
            });
        });
    }

    // ===== 搜索功能 =====
    function bindSearchFunctionality() {
        let searchTimeout;
        
        elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300);
        });
        
        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(e.target.value);
            }
        });
    }

    // ===== 执行搜索 =====
    function performSearch(query) {
        if (!query.trim()) {
            clearSearchResults();
            return;
        }
        
        // 这里可以实现实际的搜索逻辑
        // 目前只是一个示例
        const searchResults = mockSearch(query);
        displaySearchResults(searchResults);
    }

    // ===== 模拟搜索 =====
    function mockSearch(query) {
        const pages = [
            { title: 'ReCaptcha 验证码破解', url: './pages/recaptcha.html', description: 'ReCaptcha v2/v3 通用版、企业版、Steam版' },
            { title: 'hCaptcha 验证码破解', url: './pages/hcaptcha.html', description: 'hCaptcha 通用版，直接返回 generated_pass_UUID' },
            { title: 'Cloudflare 验证码破解', url: './pages/cloudflare.html', description: 'CloudFlare 盾通用版，返回 cookies 或验证码提交参数' },
            { title: '浏览器插件使用指南', url: './pages/plugin.html', description: '浏览器插件安装和使用说明' }
        ];
        
        return pages.filter(page => 
            page.title.toLowerCase().includes(query.toLowerCase()) ||
            page.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    // ===== 显示搜索结果 =====
    function displaySearchResults(results) {
        // 这里可以实现搜索结果的显示逻辑
        console.log('搜索结果:', results);
    }

    // ===== 清除搜索结果 =====
    function clearSearchResults() {
        // 清除搜索结果显示
        console.log('清除搜索结果');
    }

    // ===== 模态框功能 =====
    function bindModalFunctionality() {
        // 打开模态框的触发器
        const modalTriggers = document.querySelectorAll('[data-modal]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                openModal(modalId);
            });
        });
        
        // 关闭模态框
        elements.modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => closeModal(modal));
            }
            
            // 点击背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });
        
        // ESC 键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
    }

    // ===== 打开模态框 =====
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    // ===== 关闭模态框 =====
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // ===== 代码复制功能 =====
    function bindCodeCopyFunctionality() {
        const copyButtons = document.querySelectorAll('.copy-button');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const codeBlock = button.parentElement.querySelector('code');
                if (codeBlock) {
                    copyToClipboard(codeBlock.textContent);
                    showCopyFeedback(button);
                }
            });
        });
    }

    // ===== 复制到剪贴板 =====
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    // ===== 显示复制反馈 =====
    function showCopyFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }

    // ===== 表单验证 =====
    function bindFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!validateForm(form)) {
                    e.preventDefault();
                }
            });
            
            // 实时验证
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
            });
        });
    }

    // ===== 验证表单 =====
    function validateForm(form) {
        const fields = form.querySelectorAll('[data-required], [data-pattern], [data-min-length]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // ===== 验证字段 =====
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('data-required');
        const pattern = field.getAttribute('data-pattern');
        const minLength = field.getAttribute('data-min-length');
        
        // 清除之前的错误
        clearFieldError(field);
        
        // 必填验证
        if (isRequired && !value) {
            showFieldError(field, '此字段为必填项');
            return false;
        }
        
        // 最小长度验证
        if (minLength && value.length < parseInt(minLength)) {
            showFieldError(field, `最少需要 ${minLength} 个字符`);
            return false;
        }
        
        // 正则表达式验证
        if (pattern && value && !new RegExp(pattern).test(value)) {
            showFieldError(field, '格式不正确');
            return false;
        }
        
        return true;
    }

    // ===== 显示字段错误 =====
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    // ===== 清除字段错误 =====
    function clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // ===== 初始化交叉观察器 =====
    function initIntersectionObserver() {
        if (!window.IntersectionObserver) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        const animatedElements = document.querySelectorAll('.feature-card, .service-card, .level-card, .referral-card');
        animatedElements.forEach(el => observer.observe(el));
    }

    // ===== 初始化代码高亮 =====
    function initCodeHighlight() {
        // 如果使用了代码高亮库，在这里初始化
        // 例如 Prism.js 或 highlight.js
        if (window.Prism) {
            Prism.highlightAll();
        }
    }

    // ===== 初始化懒加载 =====
    function initLazyLoading() {
        if (!window.IntersectionObserver) return;
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===== 初始化工具提示 =====
    function initTooltips() {
        // 工具提示已通过 CSS 实现，这里可以添加额外的 JavaScript 功能
        elements.tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', () => {
                // 可以在这里添加额外的工具提示逻辑
            });
        });
    }

    // ===== 初始化进度条 =====
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar[data-progress]');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.getAttribute('data-progress');
                    
                    setTimeout(() => {
                        progressBar.style.width = `${progress}%`;
                    }, 200);
                    
                    progressObserver.unobserve(progressBar);
                }
            });
        });
        
        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    // ===== 处理 URL 哈希 =====
    function handleURLHash() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                setTimeout(() => {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }

    // ===== 重新计算元素位置 =====
    function recalculateElementPositions() {
        // 重新计算固定定位元素的位置
        const stickyElements = document.querySelectorAll('.sticky, [data-sticky]');
        stickyElements.forEach(element => {
            // 触发重新计算
            element.style.position = 'relative';
            element.offsetHeight; // 强制重排
            element.style.position = '';
        });
    }

    // ===== 节流函数 =====
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== 防抖函数 =====
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // ===== 工具函数：获取元素偏移 =====
    function getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    }

    // ===== 工具函数：检查元素是否在视口中 =====
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ===== 错误处理 =====
    window.addEventListener('error', (e) => {
        console.error('JavaScript 错误:', e.error);
        // 可以在这里添加错误报告逻辑
    });

    // ===== 页面卸载前的清理 =====
    window.addEventListener('beforeunload', () => {
        // 清理定时器、事件监听器等
        console.log('页面卸载，执行清理操作');
    });

    // ===== 启动应用 =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== 导出公共 API =====
    window.NoCaptchaApp = {
        openModal,
        closeModal,
        switchLanguage,
        scrollToTop,
        performSearch
    };

    
    !function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"KpyT6FPhJ7phumpC",ck:"KpyT6FPhJ7phumpC",autoTrack:true});
})(); 