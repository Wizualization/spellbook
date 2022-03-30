# The Visard's Spellbook

A code notebook that's integrated with wizualization.

# Notes
There's some `npm link`ing between this and wizualization.
Things you need to do in this repo:
1. `npm link` from top level spellbook directory, then
2. 
```
cd node_modules/react
npm link
cd ../react-dom
npm link
cd ../@types/react
npm link
cd ../../@types/react-dom
npm link
cd ../../three
npm link
cd ../@types/three
npm link
cd ../../react-three-fiber
npm link
cd ../@react-three/fiber
npm link
cd ../../@react-three/drei
npm link
cd ../../@react-three/cannon
npm link
cd ../../@react-three/xr
npm link
cd ../../..
```