const cubeContainer = document.getElementById('cube-container');
const resetButton = document.getElementById('reset-button');

let cubeRotation = { x: 0, y: 0 }; // 记录立方体的旋转角度
let selectedPoints = []; // 存储选中的点
let cubeScale = 1; // 立方体的初始缩放比例

// 创建大立方体
function createCube() {
    const cube = document.createElement('div');
    cube.className = 'cube';
    cube.style.transform = `scale(${cubeScale})`; // 只应用缩放

    // 创建5x5x5的小立方体
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            for (let z = 0; z < 5; z++) {
                const smallCube = document.createElement('div');
                smallCube.className = 'cube'; // 使用相同的类名
                smallCube.style.position = 'absolute';
                // 调整位置，使立方体的中心与页面中心对齐
                smallCube.style.transform = `translate3d(${(x - 2) * 30}px, ${(y - 2) * 30}px, ${(z - 2) * 30}px)`; // 位置调整

                // 创建小立方体的六个面
                const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
                faces.forEach(face => {
                    const faceDiv = document.createElement('div');
                    faceDiv.className = 'cube-face ' + face;
                    faceDiv.style.backgroundColor = 'rgba(35, 136, 255, 0.3)'; // 设置为 #2388FF，透明度为 0.3
                    smallCube.appendChild(faceDiv);
                });

                // 创建交叉点标记
                const pointDiv = document.createElement('div');
                pointDiv.className = 'point';
                pointDiv.style.transform = `translate3d(${(x - 2) * 30}px, ${(y - 2) * 30}px, ${(z - 2) * 30}px)`; // 位置调整
                pointDiv.style.backgroundColor = 'red'; // 设置交点的颜色
                pointDiv.style.width = '5px'; // 设置交点的宽度为5px
                pointDiv.style.height = '5px'; // 设置交点的高度为5px
                pointDiv.style.borderRadius = '50%'; // 使交点为圆形
                pointDiv.style.position = 'absolute'; // 绝对定位
                pointDiv.style.zIndex = '10'; // 确保交点在立方体上方
                pointDiv.addEventListener('click', () => selectPoint(pointDiv)); // 添加点击事件
                smallCube.appendChild(pointDiv); // 将交点添加到小立方体中

                cube.appendChild(smallCube);
            }
        }
    }

    // 创建图片并添加到立方体中
    const imageDisplay = document.createElement('img'); // 创建一个 img 元素用于显示上传的图片
    imageDisplay.style.position = 'absolute'; // 绝对定位
    imageDisplay.style.zIndex = '5'; // 确保图片在立方体上方
    cube.appendChild(imageDisplay); // 将图片添加到立方体中

    cubeContainer.appendChild(cube); // 将立方体添加到容器中
}

// 更新图片的 src
function updateImage(src) {
    const imageDisplay = cubeContainer.querySelector('img');
    if (imageDisplay) {
        const cubeSize = 30; // 大立方体的边长
        const maxSize = cubeSize * 5; // 最大尺寸为立方体边长的 5 倍
        const img = new Image();
        img.src = src;
        img.onload = function() {
            const imgRatio = img.width / img.height; // 图片的宽高比

            // 根据图片的宽高比调整图片的宽高
            if (imgRatio > 1) {
                imageDisplay.style.width = `${maxSize}px`; // 宽度为立方体边长的 5 倍
                imageDisplay.style.height = 'auto'; // 高度自动
            } else {
                imageDisplay.style.height = `${maxSize}px`; // 高度为立方体边长的 5 倍
                imageDisplay.style.width = 'auto'; // 宽度自动
            }

            // 设置图片的样式以确保其中心与立方体中心重合
            imageDisplay.style.position = 'absolute'; // 绝对定位
            imageDisplay.style.top = '50%'; // 垂直居中
            imageDisplay.style.left = '50%'; // 水平居中
            imageDisplay.style.transform = 'translate(-50%, -50%)'; // 确保图片在中心
            imageDisplay.style.zIndex = '5'; // 确保图片在立方体上方
        };
        imageDisplay.src = src; // 更新图片的 src
    }
}

// 选择点功能
function selectPoint(point) {
    if (selectedPoints.includes(point)) {
        selectedPoints = selectedPoints.filter(p => p !== point);
        point.style.backgroundColor = 'red'; // 取消选择时恢复颜色
    } else {
        selectedPoints.push(point);
        point.style.backgroundColor = 'blue'; // 选中时改变颜色
    }
    drawLines(); // 绘制连线
}

// 绘制连线
function drawLines() {
    const svg = document.getElementById('line-svg');
    
    svg.innerHTML = ''; // 清空之前的路径

    // 设置 SVG 的绝对定位
    svg.style.position = 'absolute'; // 绝对定位
    svg.style.top = '50%'; // 根据需要设置顶部位置
    svg.style.left = '50%'; // 根据需要设置左侧位置
    svg.style.transform = 'translate(-50%, -50%)'; // 确保 SVG 在中心


    if (selectedPoints.length > 0) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const canvasRect = cubeContainer.getBoundingClientRect(); // 获取立方体容器的位置

        // 使用选中点的中心位置作为起始点
        const startPoint = selectedPoints[0].getBoundingClientRect();
        const startX = startPoint.left - canvasRect.left + startPoint.width / 2;
        const startY = startPoint.top - canvasRect.top + startPoint.height / 2;
        let d = `M ${startX} ${startY}`; // 起始点

        for (let point of selectedPoints) {
            const rect = point.getBoundingClientRect();
            // 计算每个点的中心位置
            const centerX = rect.left - canvasRect.left + rect.width / 2;
            const centerY = rect.top - canvasRect.top + rect.height / 2;
            d += ` L ${centerX} ${centerY}`; // 连接到每个选中点的中心
        }

        path.setAttribute("d", d);
        path.setAttribute("stroke", "rgba(0, 204, 255, 1)"); // 使用鲜艳的蓝色
        path.setAttribute("stroke-width", "4");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        svg.appendChild(path); // 将路径添加到 SVG 中
    }
}

// 拖拽旋转功能
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

cubeContainer.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        cubeRotation.y += deltaX * 0.5; // 旋转角度
        cubeRotation.x -= deltaY * 0.5; // 旋转角度
        
        // 应用旋转和缩放
        const cube = cubeContainer.firstChild;
        cube.style.transform = `scale(${cubeScale}) rotateY(${cubeRotation.y}deg) rotateX(${cubeRotation.x}deg)`; // 应用旋转和缩放
        
        previousMousePosition = { x: event.clientX, y: event.clientY };
        drawLines(); // 在旋转时重新绘制连线
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 重置功能
resetButton.addEventListener('click', () => {
    selectedPoints.forEach(point => {
        point.style.backgroundColor = 'red'; // 恢复颜色
    });
    selectedPoints = [];
    drawLines(); // 清除连线
});

// 处理鼠标滚轮事件以调整立方体大小
document.addEventListener('wheel', (event) => {
    event.preventDefault(); // 防止页面滚动
    if (event.deltaY < 0) {
        if (cubeScale < 3) {
            cubeScale *= 1.1; // 放大
        }
    } else {
        if (cubeScale > 1) {
            cubeScale *= 0.9; // 缩小
        }
    }
    // 确保在缩放时应用相同的比例
    const cube = cubeContainer.firstChild;
    cube.style.transform = `scale(${cubeScale})`; // 应用缩放
}, { passive: false }); // 将 passive 设置为 false

// 处理图片上传
const imageUpload = document.getElementById('image-upload');

// 在处理图片上传时调用
imageUpload.addEventListener('change', (event) => {
    console.log("文件上传按钮被点击"); // 调试输出
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updateImage(e.target.result); // 更新图片
            console.log("图片加载成功，src:", e.target.result); // 调试输出
        };
        reader.readAsDataURL(file); // 读取文件
    }
});

// 在创建立方体后调用
createCube();