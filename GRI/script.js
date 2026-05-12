// 知识数据存储
let knowledgeData = [];
let currentCategory = 'all';

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadKnowledgeData();
    initCategoryButtons();
    initSearchInput();
    renderKnowledgeGrid();
});

// 从 localStorage 加载数据
function loadKnowledgeData() {
    const stored = localStorage.getItem('geographyKnowledge');
    if (stored) {
        knowledgeData = JSON.parse(stored);
    } else {
        // 添加示例数据
        knowledgeData = [
            {
                id: 1,
                title: '青藏高原',
                category: '地形地貌',
                summary: '世界最高的高原，被称为"世界屋脊"',
                coverImage: '',
                content: '青藏高原（Qinghai-Tibet Plateau）是中国最大、世界海拔最高的高原，南起喜马拉雅山脉南缘，北至昆仑山、阿尔金山和祁连山北缘，西部为帕米尔高原和喀喇昆仑山脉，东及东北部与秦岭山脉西段和黄土高原相接。青藏高原地势高亢，平均海拔4000～5000米，有"世界屋脊"和"第三极"之称。高原上湖泊众多，有纳木措、青海湖等。冻土广布，多冰川。',
                date: '2026-02-20',
                images: [],
                province: '青海',
                city: '西宁市'
            },
            {
                id: 2,
                title: '季风气候',
                category: '气候气象',
                summary: '了解季风气候的形成与分布',
                coverImage: '',
                content: '季风气候（Monsoon Climate）是指受季风支配地区的气候。夏季大陆增温快，形成低压，海洋增温慢，形成高压，风从海洋吹向大陆，带来丰富降水；冬季则相反。亚洲东部和南部是世界上最典型的季风气候区，包括热带季风气候、亚热带季风气候和温带季风气候。中国东南部、日本南部、韩国南部属于亚热带季风气候。季风气候的特点是：夏季高温多雨，冬季寒冷干燥。',
                date: '2026-02-19',
                images: [],
                province: '广东',
                city: '广州市'
            },
            {
                id: 3,
                title: '丝绸之路',
                category: '人文地理',
                summary: '连接东西方文明的重要贸易通道',
                coverImage: '',
                content: '丝绸之路（Silk Road）是古代连接亚洲、非洲和欧洲的重要商贸通道。最早由德国地理学家费迪南·冯·李希霍芬于1877年命名。这条路起始于古代中国的长安（今西安），跨越中亚、西亚，最终到达地中海地区。丝绸之路不仅促进了东西方的商品贸易，还推动了文化交流、宗教传播和科技发展。2013年，中国提出"一带一路"倡议，旨在复兴古代丝绸之路的精神。',
                date: '2026-02-18',
                images: [],
                province: '陕西',
                city: '西安市'
            },
            {
                id: 4,
                title: '可再生能源',
                category: '自然资源',
                summary: '太阳能、风能、水能等清洁能源的开发利用',
                coverImage: '',
                content: '可再生能源（Renewable Energy）是指在自然界中可以循环再生、取之不尽、用之不竭的能源。主要包括：\n\n1. 太阳能：利用光伏板将太阳能转化为电能\n2. 风能：通过风力发电机获取\n3. 水能：水力发电\n4. 生物质能：利用有机物质产生的能源\n5. 地热能：利用地球内部热量\n\n可再生能源是应对气候变化、实现可持续发展的关键。中国在太阳能和风能领域处于世界领先地位。',
                date: '2026-02-17',
                images: [],
                province: '江苏',
                city: '南京市'
            }
        ];
        saveKnowledgeData();
    }
}

// 保存数据到 localStorage
function saveKnowledgeData() {
    localStorage.setItem('geographyKnowledge', JSON.stringify(knowledgeData));
}

// 初始化分类按钮
function initCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 跳过行政区划按钮（它有单独的跳转逻辑）
            if (btn.dataset.category === '行政区划') return;
            
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderKnowledgeGrid();
        });
    });
}

// 初始化搜索输入
function initSearchInput() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchKnowledge, 300));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchKnowledge();
            }
        });
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 搜索知识
function searchKnowledge() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    renderKnowledgeGrid(keyword);
}

// 渲染知识卡片网格
function renderKnowledgeGrid(keyword = '') {
    const grid = document.getElementById('knowledgeGrid');
    if (!grid) return;
    
    const emptyState = document.getElementById('emptyState');
    const noResults = document.getElementById('noResults');

    // 根据分类和关键词过滤
    let filtered = knowledgeData;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    if (keyword) {
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            (item.summary && item.summary.toLowerCase().includes(keyword)) ||
            item.content.toLowerCase().includes(keyword)
        );
    }

    // 按日期倒序排列
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 显示/隐藏状态
    if (emptyState) emptyState.style.display = knowledgeData.length === 0 ? 'block' : 'none';
    if (noResults) noResults.style.display = knowledgeData.length > 0 && filtered.length === 0 ? 'block' : 'none';

    if (filtered.length === 0) {
        grid.innerHTML = '';
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isAdmin = currentUser && currentUser.role === 'admin';

    grid.innerHTML = filtered.map(item => `
        <div class="knowledge-card" onclick="viewKnowledge(${item.id})">
            <div class="card-cover">
                ${item.coverImage ? `<img src="${item.coverImage}" alt="${escapeHtml(item.title)}">` : `<div class="card-cover-placeholder">🌍</div>`}
            </div>
            <div class="card-content">
                <div class="card-header">
                    <span class="card-category">${item.category}</span>
                    <span class="card-date">${item.date}</span>
                </div>
                <h3 class="card-title">${escapeHtml(item.title)}</h3>
                ${item.province ? `<div class="card-region">📍 ${item.province} ${item.city || ''}</div>` : ''}
            </div>
            ${isAdmin ? `
            <div class="card-footer" onclick="event.stopPropagation()">
                <button class="card-btn edit" onclick="editKnowledge(${item.id})">编辑</button>
                <button class="card-btn delete" onclick="deleteKnowledge(${item.id})">删除</button>
            </div>
            ` : ''}
        </div>
    `).join('');
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 查看知识详情 - 跳转到详情页
function viewKnowledge(id) {
    window.location.href = 'knowledge.html?id=' + id;
}

// 编辑知识 - 跳转到编辑页
function editKnowledge(id) {
    window.location.href = 'edit.html?id=' + id;
}

// 删除知识
function deleteKnowledge(id) {
    if (confirm('确定要删除这条知识吗？')) {
        knowledgeData = knowledgeData.filter(item => item.id !== id);
        saveKnowledgeData();
        renderKnowledgeGrid();
    }
}

// 全局函数供其他页面使用
window.loadKnowledgeData = loadKnowledgeData;
window.saveKnowledgeData = saveKnowledgeData;
window.knowledgeData = knowledgeData;
