(() => {
  "use strict";

  // レコード一覧画面表示イベント
  kintone.events.on("app.record.index.show", async (event) => {
    const headerSpace = kintone.app.getHeaderMenuSpaceElement();

    // const myIndexButton = document.createElement("button");
    // myIndexButton.id = "my_index_button";
    // myIndexButton.innerText = "レコード更新";

    // 詳細アプリに変遷するボタン
    const detailButton = document.createElement("button");
    detailButton.type = "button";
    detailButton.className = "detailButton";
    detailButton.innerText = "詳細はこちら";

    // CSS要素を作る関数
    const cssCreate = (e) => {
      const t = document.createElement("style");
      t.textContent = e;
      document.head.appendChild(t);
    };

    // 達成率を計算する関数
    const AchievementRate = (num1, num2) => {
      return Math.floor((num1 / num2) * 100);
    };

    // kintone-rest-api-client を使う準備
    const client = new KintoneRestAPIClient();
    // ↓課題提出用アプリからレコード数をカウントする。
    const eachCompleteRes = await client.record.getAllRecords({
      app: firstApp.number,
    });
    console.log(firstApp.number);
    console.log(eachCompleteRes);

    //↓課題マスタ上の課題数をカウントする。
    const allTaskRes = await client.record.getAllRecords({
      app: secondApp.number,
    });

    console.log(secondApp.number);
    console.log(allTaskRes);
    console.log(allTaskRes.length);
    const taskNum = allTaskRes.length;
    // 現在開いているアプリの全課題数を取得
    // const currentAppRes = await client.record.getAllRecords({ app: 30 });
    // console.log(currentAppRes);
    // console.log(currentAppRes[0].全課題数.value);

    //↓ 重複を数えるプログラム！
    // ↓各ユーザーの課題完了数をカウントし、ユーザーごとにオブジェクトでまとめる。
    const count = {};
    for (let i = 0; i < eachCompleteRes.length; i++) {
      let elm = eachCompleteRes[i].作成者2.value;
      count[elm] = (count[elm] || 0) + 1;
    }
    // count →{
    //   BBさん: 6,
    //   石井悠人: 3,
    // }
    const countArrayName = [];
    // 上記オブジェクトのkeyのみ（ユーザー名）countArrayName配列に格納
    for (let i = 0; i < Object.keys(count).length; i++) {
      countArrayName.push(Object.keys(count)[i]);
    }
    console.log(countArrayName);

    const countArrayNum = [];
    // 上記オブジェクトのvalueのみ（各ユーザーの課題完了数）countArrayNum配列に格納
    for (let i = 0; i < Object.values(count).length; i++) {
      countArrayNum.push(Object.values(count)[i]);
    }
    console.log(countArrayNum);

    for (let i = 0; i < countArrayNum.length; i++) {
      // HTMLのリスト要素を取得し、containerとして扱う。
      const container = document.getElementById("portal-app-link-list");
      // cardをsection要素で作成
      const card = document.createElement("section");
      card.className = "card";

      // todo を作成
      const todo = document.createElement("li");
      todo.className = "todo";
      todo.textContent = countArrayName[i];
      // 　　　ランダムで割り振る画像をURLで保持。
      const images = {
        1: "https://2.bp.blogspot.com/-LqQJ7v1Vt2A/Wat2LL0B1RI/AAAAAAABGVo/JSqbIiruW0sk49jV85xOUryx7do6O3MEQCLcBGAs/s800/animal_stand_tora.png",
        2: "https://3.bp.blogspot.com/-LD7eWXxJDWc/Wat2JYWIm1I/AAAAAAABGVY/QrzmfD7ayigOx65TyW0Y_UHTAKogQ_-KgCLcBGAs/s800/animal_stand_penguin.png",
        3: "https://1.bp.blogspot.com/-TyFon191pZA/Wat2HxLN5rI/AAAAAAABGVA/oWavCFgdq_gehH0H36quuyiuStYBTtJuACLcBGAs/s800/animal_stand_kuma.png",
      };
      // ↓上記の画像オブジェクトを配列に格納する。
      const Array1 = Object.values(images);
      const Array2 = Object.keys(images);
      const imageNo = Math.floor(Math.random() * Object.keys(images).length);

      const randomImage = document.createElement("img");
      randomImage.height = "160";
      randomImage.width = "131.4";

      // ユーザー番号÷画像枚数（3枚）で余りの数に応じて割り振る画像を決定する。
      if (i % Array1.length === 0) {
        randomImage.src = Array1[0];
      } else if (i % Array1.length === 1) {
        randomImage.src = Array1[1];
      } else {
        randomImage.src = Array1[2];
      }

      const changePr = document.createElement("div");

      // 達成率（プログレスバー）を作成
      const achievement = document.createElement("progress");
      achievement.id = "achievement";
      achievement.value = AchievementRate(countArrayNum[i], taskNum);
      achievement.max = 100;
      // achievement.textContent = res[i].達成率.value;

      const achievementNum = document.createElement("div");
      achievementNum.id = "achievementNum";
      // achievementNum.textContent = val + "%";
      achievementNum.textContent = `${countArrayNum[i]}/${taskNum}  完了`;

      cssCreate(
        `.card{border-radius: 5px; box-shadow:0 2px 5px #ccc; width:208px; height:270px; text-align:center}`
      );
      cssCreate(`.detailButton{
        border-radius: 100px;
        width: 180px;
        padding: 12px;
        box-sizing: border-box;
        background: #6fa1ff;
        color: #FFF;
        text-decoration: none;
        border: none;
        text-align: center;
        margin: 8px 0;}`);
      // todo を card の中に追加する
      card.append(todo);

      card.append(randomImage);

      card.append(changePr);

      //achievement
      card.append(achievement);
      // card.append(changePr);

      card.append(achievementNum);

      // card を container の中に追加する
      container.append(card);
    }
    // 詳細アプリ変遷ボタンの配置（ボタンクリック後別タブで詳細アプリに移動）
    headerSpace.appendChild(detailButton);
    detailButton.onclick = () => {
      const url = "https://yuto0925.cybozu.com/k/30/";
      window.open(url, "_blank");
    };

    return event;
  });
})();
