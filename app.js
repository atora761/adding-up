'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDateMap=new Map();// key: 都道府県 value: 集計データのオブジェクト
rl.on('line',(lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);//年度データ
  const prefecture=columns[1];//県名データ
  const popu = parseInt(columns[3]);//人口データ
  if(year === 2010 || year===2015){
    let value = prefectureDateMap.get(prefecture);//連想配列の県名を参照する　連想配列に参照するものがない場合undefinedになる
    if(!value){//新しい県名が出たとき初期化される
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if(year === 2010){
      value.popu10 = popu;
    }
    if(year === 2015){
      value.popu15 = popu;
    }
    prefectureDateMap.set(prefecture, value);
  }
});
rl.on('close', () => {
  for(let [key, value] of prefectureDateMap){//prefectureDataMapから代入するものがなくなったときfalseを返すためループが終了する
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefectureDateMap).sort((pair1,pair2) => {
    return pair2[1].change - pair1[1].change;//降順か昇順か戻り値で判断する
  });
  const rankingStrings = rankingArray.map(([key, value])=>{
    return key + ': ' + value.popu10 + '=>' + value.popu15 + '変化量' + value.change;//Map の キーと値が要素になった配列を要素 [key, value] として受け取り、それを文字列に変換する
  })
  console.log(rankingStrings);
});
