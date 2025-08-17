# bangumi-wiki-scripts [![bangumi](http://bgm.tv/img/ico/bgm80-15.png)](http://bgm.tv)

用于 [bangumi](https://bgm.tv) wiki 的脚本合集。依赖[官方 Archive](https://github.com/bangumi/Archive)。

## 脚本

- [download_bangumi_archive.py](https://github.com/inchei/bangumi-wiki-scripts/blob/main/download_bangumi_archive.py)：获取最新 Archive
- [find_duplicate_isbns.py](https://github.com/inchei/bangumi-wiki-scripts/blob/main/find_duplicate_isbns.py)：查找重复 ISBN 的条目
  - 限定了 9784 开头（日本），因为大陆出版物很多用丛书号
  - 可指定汇报帖以排除已汇报 ISBN
  - 可以通过修改查找重复的脚本中的 WHITE_LIST，设置丛书号等不参与查找的 ISBN 的白名单
- [filter_by_fields.py](https://github.com/inchei/bangumi-wiki-scripts/blob/main/filter_by_fields.py)：查找指定字段含有指定文本/符合指定正则表达式/有无指定关联/有无指定标签的条目

## GitHub Actions
当前执行的自动任务：
- 每周二 UTC 21:30 （官方 Archive 更新后约半小时），拉取最新 Archive，查找重复 ISBN 条目，上传最新结果：[duplicate_check_results.txt](https://raw.githubusercontent.com/inchei/bangumi-wiki-scripts/refs/heads/main/duplicate_check_results.txt)
