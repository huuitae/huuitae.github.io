import { input } from '@inquirer/prompts'
import fs from 'fs'
import path from 'path'
import { isFileNameSafe } from './utils.js'

function getProjectFullPath(fileName) {
  return path.join('./src/content/projects', `${fileName}.yaml`)
}

const fileName = await input({
  message: '파일 이름을 입력하세요',
  validate: (value) => {
    if (!isFileNameSafe(value)) {
      return '파일 이름에는 문자, 숫자, 하이픈만 사용할 수 있습니다.'
    }
    const fullPath = getProjectFullPath(value)
    if (fs.existsSync(fullPath)) {
      return `${fullPath}는 이미 존재하는 파일입니다.`
    }
    return true
  },
})

const title = await input({
  message: '프로젝트 이름을 입력하세요',
})
const description = await input({
  message: '프로젝트 설명을 입력하세요',
})
const link = await input({
  message: '프로젝트 주소를 입력하세요',
})
const image = await input({
  message: '미리보기 이미지 주소를 입력해주세요',
})

const content = `title: ${title}
description: ${description}
link: ${link}
image: ${image}
`

const fullPath = getProjectFullPath(fileName)
fs.writeFileSync(fullPath, content)
// console.log(`${fullPath} 创建成功`)
