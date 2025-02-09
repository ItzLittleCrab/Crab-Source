// 资源数据示例
const resources = [
    {
        id: 1,
        name: "高级机械模组",
        category: "模组",
        description: "添加了大量科技感机械设备，提升游戏可玩性",
        image: "images/default.jpg"
    },
    {
        id: 2,
        name: "科幻建筑包",
        category: "材质包",
        description: "未来风格的建筑材质，打造科幻城市",
        image: "images/default.jpg"
    },
    // 示例资源 3
    {
        id: 3,
        name: "红石工程模组",
        category: "模组",
        description: "扩展红石功能，添加更多自动化可能",
        image: "images/default.jpg"
    },
    // 示例资源 4
    {
        id: 4,
        name: "中世纪城堡地图",
        category: "地图",
        description: "精致的中世纪风格城堡，包含多个区域",
        image: "images/default.jpg"
    },
    // 可以添加更多资源...
];

// 实时搜索功能
document.querySelector('.search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterResources(searchTerm, currentCategory);
});

// 分类过滤
let currentCategory = '全部';
document.querySelectorAll('.category-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        currentCategory = tag.textContent;
        filterResources(document.querySelector('.search-input').value.toLowerCase(), currentCategory);
    });
});

// 资源过滤函数
function filterResources(searchTerm, category) {
    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm) || 
                            resource.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === '全部' || resource.category === category;
        return matchesSearch && matchesCategory;
    });
    
    renderResources(filteredResources);
}

// 检查图片是否存在的函数
function checkImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// 获取资源的实际图片路径
async function getImagePath(resource) {
    // 尝试加载资源特定图片
    const specificImage = `images/${resource.category.toLowerCase()}/${resource.id}.jpg`;
    const exists = await checkImage(specificImage);
    return exists ? specificImage : 'images/default.jpg';
}

// 修改渲染资源列表函数
async function renderResources(resources) {
    const grid = document.querySelector('.resource-grid');
    
    // 清空网格并显示加载状态
    grid.innerHTML = '<div class="loading">加载中...</div>';
    
    // 等待所有图片路径的检查
    const resourcesWithImages = await Promise.all(resources.map(async (resource) => ({
        ...resource,
        imagePath: await getImagePath(resource)
    })));
    
    // 渲染资源卡片
    grid.innerHTML = resourcesWithImages.map(resource => `
        <div class="resource-card">
            <div class="resource-image">
                <img src="${resource.imagePath}" 
                     alt="${resource.name}">
            </div>
            <div class="resource-content">
                <h3>${resource.name}</h3>
                <p>${resource.description}</p>
                <div class="card-actions">
                    <button class="download-btn" onclick="downloadResource(${resource.id})">下载</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 下载功能
function downloadResource(id) {
    const resource = resources.find(r => r.id === id);
    if (resource) {
        // 这里可以添加实际的下载逻辑
        alert(`开始下载: ${resource.name}`);
    }
}

// 初始化显示
renderResources(resources); 