Build
======

```sh
rm -fr lib/community-edition
npm run build # can be errors, ignore them 
cp .local-config/.npmrc lib/community-edition
cp .local-config/package.json lib/community-edition
cd lib/community-edition
npm publish
```
