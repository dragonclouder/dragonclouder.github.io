// document.getElementById('create-new-post').addEventListener('click', async () => {
//   try {
//     const title = prompt('请输入文章标题：', '新帖子');
//     if (!title) return;

//     const response = await fetch(`/tools/new_post.sh?title=${encodeURIComponent(title)}`);
//     const result = await response.text();

//     // 修改判断条件为实际返回内容
//     const successMsg = result.startsWith('新文章已创建') ? 
//       `✅ ${result.split("：")[1]}` : 
//       `❌ ${result}`;
      
//     alert(successMsg);
    
//     // 添加延时确保提示可见
//     setTimeout(() => {
//       window.location.reload();
//     }, 1000);

//   } catch (error) {
//     console.error('请求错误:', error);
//     alert(`❌ 请求异常：${error.message}`);
//   }
// });

document.getElementById('create-new-post').addEventListener('click', function() {
  // const title = document.getElementById('postTitle').value || '默认标题';
  const title = prompt('请输入文章标题：', '新帖子');
  const encodedTitle = encodeURIComponent(title); // 对标题进行URL编码
  const url = `http://localhost:8080/tools/new_post.sh?title=${encodedTitle}`;

  fetch(url)
      .then(response => {
          if (!response.ok) {
              // 如果响应状态不是 2xx，也读取文本内容看是否有错误信息
              return response.text().then(text => {
                  throw new Error(`HTTP error ${response.status}: ${text}`);
              });
          }
          return response.text(); // 获取脚本的输出
      })
      .then(data => {
          console.log('脚本执行成功:', data);
          alert('脚本执行成功:\n' + data); // 显示脚本的输出
          // 这里可以根据脚本的输出更新页面，例如显示成功消息
      })
      .catch(error => {
          console.error('请求脚本失败:', error);
          alert('请求脚本失败:\n' + error.message);
      });
});
