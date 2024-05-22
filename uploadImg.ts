import { PicGo } from 'picgo';
import dayjs from 'dayjs';

const picgo = new PicGo('./picgoConfig.json'); // 使用默认的配置文件

export const uploadImg = async (filePath: string, name: string, githubName: string) => {
  picgo.helper.beforeUploadPlugins.register('upload', {
    handle: (ctx) => {
      const output = ctx.output;

      for (const item in output) {
        output[item].fileName = `${dayjs().format('YYYY-MM-DD-HH-mm-ss')}_${name}`;
      }

      return ctx;
    },
  });

  picgo.upload([filePath]).then((res: any) => {
    console.log('------ndzy------', JSON.stringify({ github: githubName, url: res[0].imgUrl }), '------ndzy------');
  });
};

const path1 = '/Users/ndzy/Desktop/ndzy/ndzy-tool/ndzy.png';
uploadImg(path1, 'ndzy.png', 'img');
