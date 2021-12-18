Build
======

```sh
rm -fr cd lib/community-edition
npm run build # can be errors, ignore them 
cp .local-config/.npmrc
cp .local-config/package.json
cd lib/community-edition
npm publish
```
