FROM node:20

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "start"]
