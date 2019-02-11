# Routine Design

Docker image with the routine-design Nodejs package globally installed.

## Publish new version

First build, and tag as `routine-design`.

```
docker build -t lynnmercier/routine-design .
docker push lynnmercier/routine-design:latest
```