#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// package.json 경로
const packageJsonPath = path.resolve(__dirname, '../package.json');

// package.json 읽기
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 현재 버전을 파싱
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// patch 버전 증가
const newVersion = `${major}.${minor}.${patch + 1}`;

// package.json 업데이트
packageJson.version = newVersion;

// 파일에 쓰기
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`버전이 업데이트되었습니다: ${packageJson.version} → ${newVersion}`);