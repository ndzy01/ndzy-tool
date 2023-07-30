import fs from 'fs';
import path from 'path';
import { PicGo } from 'picgo';
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL, DOCS_ROOT, STORE_GITHUB } from './config';

const picgo = new PicGo(); // 使用默认的配置文件
const docsRoot = DOCS_ROOT;
const baseUrl = BASE_URL;
const store_github = STORE_GITHUB;

const saveImg = (name: string, storeGithub: string) => {
  let data: any = fs.readFileSync('./public/img_db.json', 'utf-8');
  data = JSON.parse(data);
  const result = data.find((item: { label: string; value: string[] }) => item.label === storeGithub);

  if (result) {
    data.forEach((ele: { label: string; value: string[] }) => {
      if (ele.label === storeGithub) {
        ele.value.push(name);
      }
    });
  } else {
    data.push({ label: storeGithub, value: [] });
  }

  fs.writeFileSync('./public/img_db.json', JSON.stringify(data), 'utf-8');
};

const readFileList = (dir: string, filesList: { filePath: string }[] = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((item) => {
    const filePath = path.join(dir, item);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList);
    } else {
      filesList.push({
        filePath,
      });
    }
  });

  return filesList;
};

export const uploadImg = async (dir: string) => {
  const list = readFileList(dir);
  let i = 0;

  picgo.helper.beforeUploadPlugins.register('upload', {
    handle: (ctx) => {
      const output = ctx.output;

      for (const item in output) {
        const name = 'NDZY_' + uuidv4() + '_' + output[item].fileName!;
        output[item].fileName = name;

        saveImg(baseUrl + name, store_github);
      }

      return ctx;
    },
  });

  for await (const item of list) {
    if (i < list.length) {
      await picgo.upload([item.filePath]);

      i++;
    }
  }
};

uploadImg(docsRoot);
