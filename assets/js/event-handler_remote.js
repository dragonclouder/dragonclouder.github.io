document.getElementById('create-new-post').addEventListener('click', async () => {
  try {
    const title = prompt('请输入文章标题：', '新帖子');
    if (!title) {
        alert('文章标题不能为空！');
        return;
    }

    // ###################################################################################
    // # 重要安全提示 (IMPORTANT SECURITY WARNING):                                     #
    // ###################################################################################
    // # 即便只是触发 repository_dispatch 事件，直接在客户端 JavaScript 中处理           #
    // # Personal Access Token (PAT) 仍然存在安全风险。理想情况下，应通过一个受信任的    #
    // # 后端代理来完成此操作。                                                          #
    // # 此 PAT 需要 'repo' 范围的权限才能成功触发 repository_dispatch 事件。          #
    // ###################################################################################
    const githubToken = prompt('请输入您的 GitHub Personal Access Token (需要 "repo" 权限以触发 Action):');
    if (!githubToken) {
      alert('GitHub Token 是触发创建文章 Action 所必需的！');
      return;
    }

    const repoOwner = 'dragonclouder'; // 您的 GitHub 用户名或组织名
    const repoName = 'dragonclouder.github.io'; // 您的仓库名称
    const eventType = 'create-new-post'; // 必须与 GitHub Action workflow 中 `on.repository_dispatch.types` 匹配

    const dispatchUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`;

    const response = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json', // GitHub API v3
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        client_payload: { // client_payload 会被传递给 GitHub Action
          title: title
        }
      }),
    });

    // repository_dispatch 成功时返回 204 No Content
    if (response.status === 204) {
      alert(`✅ 请求已成功发送！\n新的文章 "${title}" 正在通过 GitHub Action 创建。\n请稍后在您的仓库 "Actions" 标签页查看进度，并在几分钟后刷新页面查看新文章。`);
      // GitHub Actions 执行需要一些时间，可以不立即刷新或设置更长的延时
      // setTimeout(() => {
      //   window.location.reload();
      // }, 30000); // 例如，延迟30秒
    } else {
      // 尝试解析错误信息
      const errorResult = await response.json().catch(() => ({ message: response.statusText || `HTTP Error ${response.status}` }));
      alert(`❌ 发送创建请求失败 (状态: ${response.status}):\n${errorResult.message}`);
      console.error('GitHub API Dispatch Error:', errorResult);
    }

  } catch (error) {
    console.error('请求错误:', error);
    alert(`❌ 请求异常：${error.message}`);
  }
});

