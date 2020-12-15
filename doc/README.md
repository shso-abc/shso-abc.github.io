# Kakao i Cloud Guide Center

## Develop Environment Setup

### Server Start

```bash
$ bundle exec jekyll serve
```

```bash
$ jekyll serve
```


## 문서편집( md, yml 파일 수정시 ) 시에 로컬 pc 에서 결과물 확인
### Install
[docker desktop 설치](https://www.docker.com/products/docker-desktop)

### build
- 파인더에서 /build_start.command 파일을 더블 클릭 하여 도커 컨테이너를 실행하여 브라우저 http://localhost:4000 에서 확인.
- 도커  컨테이너가 실행된 후에는 /build_restart.command 파일을 더블 클릭하고 http://localhost:4000 에서 수정사항을 확인.
- 종료: /build_stop.command 더블 클릭하여 도커 컨테이너를 종료.

## 카테고리 규칙

- `key` 값은 반드시 고유해야 합니다. 겹치는 키값이 있어서는 안됩니다.
- 카테고리: `_posts` 안에 있는 `folder name`과 `config` 파일의 `key` 값이 일치해야 합니다.
- 문서: `_posts` 안에 있는 `file name`과 문서 내부의 `key`가 `config` 파일의 `key` 값이 일치해야 합니다.

```yaml
GNBMenu:
  children:
    - key: home
      koName: HOME
    - key: overview
      koName: Overview
      external: https://www.kakaoicloud.com/
```
