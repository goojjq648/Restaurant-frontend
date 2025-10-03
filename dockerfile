# 使用 Node 22 (bookworm 版穩定、適合開發)
FROM node:22-bookworm

# 建立工作目錄
WORKDIR /app

# 預設命令會被 docker-compose 覆蓋
CMD ["bash", "-lc", "node -v && npm -v"]
