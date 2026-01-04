/**
 * NoCaptcha.io 组件 JavaScript 文件
 * 包含各种可复用的组件和功能模块
 */

(function() {
    'use strict';

    // ===== Markdown 渲染器 =====
    class MarkdownRenderer {
        constructor(options = {}) {
            this.options = {
                breaks: true,
                linkify: true,
                typographer: true,
                ...options
            };
        }

        render(markdown) {
            // 简单的 Markdown 渲染实现
            let html = markdown;
            
            // 标题
            html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
            html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
            html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
            
            // 粗体
            html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
            
            // 斜体
            html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
            
            // 代码
            html = html.replace(/`(.*?)`/gim, '<code>$1</code>');
            
            // 链接
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
            
            // 段落
            html = html.replace(/\n\n/gim, '</p><p>');
            html = '<p>' + html + '</p>';
            
            return html;
        }
    }

    // ===== 代码标签切换器 =====
    class CodeTabSwitcher {
        constructor(container) {
            this.container = container;
            this.tabs = container.querySelectorAll('.code-tab');
            this.contents = container.querySelectorAll('.code-content');
            
            this.init();
        }

        init() {
            this.tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => this.switchTab(index));
            });
        }

        switchTab(activeIndex) {
            // 移除所有活动状态
            this.tabs.forEach(tab => tab.classList.remove('active'));
            this.contents.forEach(content => content.style.display = 'none');
            
            // 激活选中的标签和内容
            this.tabs[activeIndex].classList.add('active');
            if (this.contents[activeIndex]) {
                this.contents[activeIndex].style.display = 'block';
            }
        }
    }

    // ===== 目录生成器 =====
    class TOCGenerator {
        constructor(options = {}) {
            this.options = {
                container: '.doc-content',
                tocContainer: '.toc',
                headings: 'h2, h3, h4',
                ...options
            };
        }

        generate() {
            const container = document.querySelector(this.options.container);
            const tocContainer = document.querySelector(this.options.tocContainer);
            
            if (!container || !tocContainer) return;
            
            const headings = container.querySelectorAll(this.options.headings);
            if (headings.length === 0) return;
            
            const tocList = document.createElement('ul');
            tocList.className = 'toc-list';
            
            headings.forEach((heading, index) => {
                // 为标题添加 ID
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }
                
                // 创建目录项
                const tocItem = document.createElement('li');
                tocItem.className = `toc-item level-${heading.tagName.toLowerCase()}`;
                
                const tocLink = document.createElement('a');
                tocLink.className = 'toc-link';
                tocLink.href = `#${heading.id}`;
                tocLink.textContent = heading.textContent;
                
                tocItem.appendChild(tocLink);
                tocList.appendChild(tocItem);
            });
            
            tocContainer.appendChild(tocList);
        }
    }

    // ===== 搜索高亮器 =====
    class SearchHighlighter {
        constructor() {
            this.originalContent = new Map();
        }

        highlight(query, container = document.body) {
            if (!query.trim()) {
                this.clearHighlights(container);
                return;
            }
            
            const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            
            while (node = walker.nextNode()) {
                if (node.parentElement.tagName !== 'SCRIPT' && 
                    node.parentElement.tagName !== 'STYLE') {
                    textNodes.push(node);
                }
            }
            
            textNodes.forEach(textNode => {
                const parent = textNode.parentElement;
                if (regex.test(textNode.textContent)) {
                    const highlightedHTML = textNode.textContent.replace(
                        regex, 
                        '<mark class="search-highlight">$1</mark>'
                    );
                    
                    if (!this.originalContent.has(parent)) {
                        this.originalContent.set(parent, parent.innerHTML);
                    }
                    
                    parent.innerHTML = parent.innerHTML.replace(
                        textNode.textContent, 
                        highlightedHTML
                    );
                }
            });
        }

        clearHighlights(container = document.body) {
            const highlights = container.querySelectorAll('.search-highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentElement;
                parent.replaceChild(
                    document.createTextNode(highlight.textContent), 
                    highlight
                );
            });
            
            this.originalContent.clear();
        }

        escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    }

    // ===== 面包屑导航生成器 =====
    class BreadcrumbGenerator {
        constructor(options = {}) {
            this.options = {
                container: '.breadcrumb',
                separator: '/',
                homeText: '首页',
                homeUrl: '/',
                ...options
            };
        }

        generate() {
            const container = document.querySelector(this.options.container);
            if (!container) return;
            
            const path = window.location.pathname;
            const segments = path.split('/').filter(segment => segment);
            
            // 清空容器
            container.innerHTML = '';
            
            // 添加首页链接
            this.addBreadcrumbItem(container, this.options.homeText, this.options.homeUrl);
            
            // 添加路径段
            let currentPath = '';
            segments.forEach((segment, index) => {
                currentPath += '/' + segment;
                const isLast = index === segments.length - 1;
                const text = this.formatSegment(segment);
                
                if (isLast) {
                    this.addBreadcrumbItem(container, text, null, true);
                } else {
                    this.addBreadcrumbItem(container, text, currentPath);
                }
            });
        }

        addBreadcrumbItem(container, text, url, isActive = false) {
            const item = document.createElement('span');
            item.className = 'breadcrumb-item';
            
            if (isActive) {
                item.classList.add('current');
                item.textContent = text;
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.textContent = text;
                item.appendChild(link);
            }
            
            container.appendChild(item);
            
            // 添加分隔符（除了最后一项）
            if (!isActive) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = this.options.separator;
                container.appendChild(separator);
            }
        }

        formatSegment(segment) {
            return segment
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }
    }

    // ===== 进度指示器 =====
    class ProgressIndicator {
        constructor(options = {}) {
            this.options = {
                container: '.progress-container',
                color: '#6366f1',
                height: '3px',
                ...options
            };
            
            this.init();
        }

        init() {
            this.createProgressBar();
            this.bindEvents();
        }

        createProgressBar() {
            const container = document.querySelector(this.options.container) || document.body;
            
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'reading-progress';
            this.progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: ${this.options.height};
                background-color: ${this.options.color};
                z-index: 9999;
                transition: width 0.3s ease;
            `;
            
            container.appendChild(this.progressBar);
        }

        bindEvents() {
            window.addEventListener('scroll', () => this.updateProgress());
            window.addEventListener('resize', () => this.updateProgress());
        }

        updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.pageYOffset;
            const progress = (scrollTop / documentHeight) * 100;
            
            this.progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    // ===== 图片灯箱 =====
    class ImageLightbox {
        constructor() {
            this.currentIndex = 0;
            this.images = [];
            this.init();
        }

        init() {
            this.createLightbox();
            this.bindEvents();
        }

        createLightbox() {
            this.lightbox = document.createElement('div');
            this.lightbox.className = 'lightbox';
            this.lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="">
                    <button class="lightbox-close">&times;</button>
                    <button class="lightbox-prev">&#8249;</button>
                    <button class="lightbox-next">&#8250;</button>
                </div>
            `;
            
            document.body.appendChild(this.lightbox);
        }

        bindEvents() {
            // 绑定图片点击事件
            document.addEventListener('click', (e) => {
                if (e.target.matches('.responsive-image, .gallery-image')) {
                    this.openLightbox(e.target);
                }
            });
            
            // 绑定灯箱控制事件
            this.lightbox.addEventListener('click', (e) => {
                if (e.target.classList.contains('lightbox-close') || 
                    e.target.classList.contains('lightbox')) {
                    this.closeLightbox();
                }
                
                if (e.target.classList.contains('lightbox-prev')) {
                    this.showPrevious();
                }
                
                if (e.target.classList.contains('lightbox-next')) {
                    this.showNext();
                }
            });
            
            // 键盘事件
            document.addEventListener('keydown', (e) => {
                if (!this.lightbox.classList.contains('active')) return;
                
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.showPrevious();
                        break;
                    case 'ArrowRight':
                        this.showNext();
                        break;
                }
            });
        }

        openLightbox(image) {
            this.images = Array.from(document.querySelectorAll('.responsive-image, .gallery-image'));
            this.currentIndex = this.images.indexOf(image);
            
            this.showImage(image.src);
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        closeLightbox() {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        showImage(src) {
            const img = this.lightbox.querySelector('.lightbox-image');
            img.src = src;
        }

        showPrevious() {
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this.showImage(this.images[this.currentIndex].src);
        }

        showNext() {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.showImage(this.images[this.currentIndex].src);
        }
    }

    // ===== 初始化所有组件 =====
    function initializeComponents() {
        // 初始化代码标签切换器
        document.querySelectorAll('.code-example').forEach(container => {
            new CodeTabSwitcher(container);
        });
        
        // 初始化目录生成器
        new TOCGenerator().generate();
        
        // 初始化面包屑导航
        new BreadcrumbGenerator().generate();
        
        // 初始化进度指示器
        new ProgressIndicator();
        
        // 初始化图片灯箱
        new ImageLightbox();
        
        // 初始化搜索高亮器
        window.searchHighlighter = new SearchHighlighter();
        
        console.log('所有组件初始化完成');
    }

    // ===== 导出到全局 =====
    window.NoCaptchaComponents = {
        MarkdownRenderer,
        CodeTabSwitcher,
        TOCGenerator,
        SearchHighlighter,
        BreadcrumbGenerator,
        ProgressIndicator,
        ImageLightbox
    };

    // ===== 页面加载完成后初始化 =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        initializeComponents();
    }
    

})(); 