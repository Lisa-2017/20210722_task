# 一、简答题


#### 1、简述前端兼容性的解决方案及不同工具的使用(JS/CSS)
css兼容:
  不同浏览器的标签默认的margin和padding不同
  css3新属性，加浏览器前缀兼容早期浏览器
  块属性标签float后，又有横行的margin情况下，IE 浏览器margin加倍的问题
  设置较小高度标签（一般小于10px），在IE6，IE7，遨游中高度超出自己设置高度
  行内属性标签，设置display:block后采用float布局，又有横行的margin的情况，IE6间距bug
  IE浏览器div最小宽度和高度的问题
  超链接访问过后hover样式就不出现的问题
  图片默认有间距
  css hack解决浏览器兼容性

JS兼容:
  事件绑定
  event事件对象问题
  event.srcElement(事件源对象)问题
  获取元素的非行间样式值
  阻止事件冒泡传播
  阻止事件默认行为：
   ajax兼容问题

#### 2.列举三种常见的wbepack打包优化手段及使用步骤
按需加载、优化loader配置、关闭、生产环境sourceMap、CDN优化

使用步骤:
 下载和使用webpack
 webpack 更新打包
 webpack的配置
 插件-自动生成html文件
 加载器 - 处理css文件问题
 加载器 - 处理css文件
 加载器 - 处理less文件
 加载器 - 处理图片文件
 加载器 - 处理字体文件
 加载器 - 处理高版本js语法
 webpack-dev-server自动刷新
