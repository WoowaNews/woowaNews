# Railway Deploy

## 서비스 구성

- 단일 Railway 서비스에서 Spring Boot jar를 실행합니다.
- Railpack 빌드 중 프론트엔드는 Node 20으로 `frontend/dist`에 빌드된 뒤 Spring Boot static resource로 jar에 포함됩니다.
- 데이터베이스는 MySQL 8.0을 사용하며 기본 데이터베이스명은 `woowa_news`입니다.

## 필요한 환경 변수

```env
MYSQLHOST=
MYSQLPORT=
MYSQLDATABASE=
MYSQLUSER=
MYSQLPASSWORD=
GITHUB_TOKEN=
```

Railway MySQL 플러그인을 연결하면 `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD` 값을 서비스 환경 변수에 등록합니다.

## 빌드와 실행

Railway는 루트의 `railway.json`을 기준으로 Railpack 빌더를 사용합니다.

```sh
npm run build
```

배포 시에는 아래 명령으로 jar를 실행합니다.

```sh
java -jar backend/build/libs/woowaNews-0.0.1-SNAPSHOT.jar
```

## GitHub Actions

- `develop` push와 `develop`, `main` 대상 PR에서 CI가 실행됩니다.
- `main` push에서 Railway 배포 워크플로가 실행됩니다.
- 배포에는 `RAILWAY_TOKEN` secret이 필요합니다.
