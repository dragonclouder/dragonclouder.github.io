document.getElementById('create-new-post').addEventListener('click', async () => {
  try {
    const title = prompt('请输入文章标题：', '新帖子');
    if (!title) return;

    const response = await fetch(`/tools/new_post.sh?title=${encodeURIComponent(title)}`);
    const result = await response.text();

    // 修改判断条件为实际返回内容
    const successMsg = result.startsWith('新文章已创建') ? 
      `✅ ${result.split("：")[1]}` : 
      `❌ ${result}`;
      
    alert(successMsg);
    
    // 添加延时确保提示可见
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error('请求错误:', error);
    alert(`❌ 请求异常：${error.message}`);
  }
});

