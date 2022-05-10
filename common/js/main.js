window.addEventListener('DOMContentLoaded', function() {
  //json 데이터
  // const jsonUrl = 'https://raw.githubusercontent.com/hoseonkwak/toy_project/master/bank.json';
  const jsonUrl = '../bank.json';
  const dataResult = fetch(jsonUrl)
    .then((res) => {
      return res.json();
    })
    .then((obj) => {
      //console.log(obj.bankList[0]);
      const date = new Date();
      main_money(obj);  // 잔고
      progressbar(obj, date); // 계좌 그래프, 남은 금액
      accountHistory(obj, date);  // 계좌내역
      dateChart(obj, date); // 일간 그래프
      console.log(obj.bankList);
    });



  // 잔고
  function main_money(obj) {
    let minus = 0;  //지출
    let plus = 0; //수입

    const main_money = document.querySelector('.account_balance_area span');

    // 지출
    const outArray = obj.bankList.filter(function(e) {
      return e.income === 'out';
    });
    //console.log(outArray);
    for(let i = 0; i < outArray.length; i++){
      minus += outArray[i].price;
    }

    // 수입
    const inArray = obj.bankList.filter((e) => {
      return e.income === 'in';
    });
    for(let i = 0; i < inArray.length; i++){
      plus += inArray[i].price;
    }

    // html 수정
    main_money.textContent = priceToString(plus - minus);

  }

  // const myMoney = ;

  const winhh = window.outerHeight;

  //사이즈가 조절될 때
  window.addEventListener('resize', () => {
    //console.log(winhh);
    const mainhh2 = window.outerHeight;
    sethh(mainhh2);
  });
  sethh(winhh);

  // 지출관리 열기
  const openManage = document.querySelector('.account_goal_area .manage_btn');
  openManage.addEventListener('click', () => {
    document.querySelector('.manage_wrap').style.cssText = 'opacity: 1; top: 0';
  });

  // 지출관리 닫기버튼
  const manageCloseBtn = document.querySelector('.manage_wrap header.manage_header .close_btn');
  manageCloseBtn.addEventListener('click', () => {
    document.querySelector('.manage_wrap').style.cssText = 'opacity: 0; top: 100%';
  })

  /* 메인화면 높이 조절 */
  function sethh(winhh){
    const mainHeader = document.querySelector('.main_header');
    const mainHeaderhh = mainHeader.offsetHeight;
    const accountMain = document.querySelector('.account_main');
    const accountMainhh = accountMain.offsetHeight;
    const accountHistory =  document.querySelector('.account_history');
    //const accountHistoryhh = accountHistory.offsetHeight;
    const mainMenu = document.querySelector('.menu');
    const menuhh = mainMenu.offsetHeight;
    const managehh = document.querySelector('.manage_wrap');

    //accountHistory 높이 설정
    const setAccountHishh = winhh - mainHeaderhh - accountMainhh - menuhh;
    accountHistory.style.height = `${setAccountHishh}px`;

    managehh.style.height = `${winhh - menuhh}px`;
    
  }

  // progressbar
  function progressbar(obj, date){
    /*
    * 전체, 목표, 쓴 금액, 디데이, 사용가능 금액, 월급
    * 현재는 이번달 지출 / 이번달 목표액 * 100
    */
    // 이번달 구하기
    //const date = new Date();
    const thisMonth = date.getMonth() +1 ;
    const thisMonthString = String(thisMonth).padStart(2, '0'); // 이번달 문자형으로 추출
    const monthPay = 3000000; // 월급
    const limitMoney = 2000000; //이번달 limit
    const goalBar = document.querySelector('.account_goal_area .progressbar .goal_bar');
    const goalStick = document.querySelector('.progressbar .goal_stick');
    const now_bar = document.querySelector('.progressbar .now_bar');

    let sum = 0;  //전체
    let thisMonthOut = 0;
    // console.log(thisMonth);
    // console.log(String(thisMonth).padStart(2, '0'));
    // console.log(obj.bankList[0].date);
    // console.log(obj.bankList[0].date.substr(5, 2));
    // console.log(obj.bankList[0].date.substr(5, 2) === thisMonthString);

    // 총 잔고
    for(let i = 0; i < obj.bankList.length; i++){
      sum += obj.bankList[i].price;
    }

    // 이번달 지출 금액
    const thisMonthOutArr = obj.bankList.filter(function(e) {
      return e.date.substr(5, 2) === thisMonthString && e.income === 'out';
    });
    //console.log(thisMonthOutArr);
    for(let i = 0; i < thisMonthOutArr.length; i++){
      thisMonthOut += thisMonthOutArr[i].price;
    }
    // console.log(thisMonthOut);

    // 현재 사용 %
    const nowPer = thisMonthOut / limitMoney * 100;
    now_bar.style.width = `${nowPer}%`;
    
    // 이번달 목표 금액
    const thisGoalMoney = limitMoney / monthPay *100;
    goalStick.style.left = `${thisGoalMoney.toFixed(2)}%`;
    goalBar.style.width = `${thisGoalMoney.toFixed(2)}%`;
    
    // 몇일 남았는지와 사용 가능 금액
    const lastDate = new Date(date.getFullYear(),date.getMonth()+1, 0).getDate();
    const remainDate = lastDate - date.getDate();
    //console.log(remainDate);

    // 이번달 남을 일
    document.querySelector('.account_goal_area .term').textContent = remainDate;
    // 사용 가능 금액
    document.querySelector('.account_goal_area .pay').textContent = priceToString(limitMoney - thisMonthOut);

    //지출관리
    const manageGoalBar = document.querySelector('.progressbar.manage .goal_bar');
    const manageGoalStick = document.querySelector('.progressbar.manage .goal_stick');
    const manageNow_bar = document.querySelector('.progressbar.manage .now_bar');

    manageNow_bar.style.width = `${nowPer}%`;
    manageGoalStick.style.left = `${thisGoalMoney.toFixed(2)}%`;
    manageGoalBar.style.width = `${thisGoalMoney.toFixed(2)}%`;
  }

  // account_history
  function accountHistory(obj, date){
    
    const dayUl = document.querySelector('.account_history_area .day_history');

    let dateI = [];

    for(let i = 0; i < obj.bankList.length; i++){
      dateI.push(obj.bankList[i].date); 
    }
    // 겹치는 날짜 제거
    //console.log(dateI);
    const set = new Set(dateI.reverse());
    //console.log(set);
    
    // day_li.textContent = [...set][0];
    // console.log([...set][0]);
    const thisMonth = date.getMonth() +1 ;
    const thisMonthString = String(thisMonth).padStart(2, '0'); // 이번달 문자형으로 추출
    
    for(let i = 0; i < [...set].length; i++){
      //태그 만들기
      const day_li = document.createElement('li');
      const title_area = document.createElement('div');
      title_area.classList.add('title_area');
      const item_strong = document.createElement('strong');
      const item_p = document.createElement('p');
      const item_span = document.createElement('span');
      const history_cont = document.createElement('ul');
      history_cont.classList.add('history_cont');
      

      const todayChk = `${date.getFullYear()}-${String(thisMonth).padStart(2, '0')}-${date.getDate()}`;
      const ydayChk = `${date.getFullYear()}-${String(thisMonth).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`;

      //console.log(ydayChk);
      //console.log([...set][i]);

      
      if([...set][i] === todayChk){
        // console.log('ok');
        item_strong.textContent = '오늘';
      } else if([...set][i] === ydayChk) {
        // console.log('not');?
        item_strong.textContent = '어제';
      } else{
        item_strong.textContent = [...set][i];
      }

      // 지출
      let dailyOut = 0;
      const dailyArray = obj.bankList.filter(function(e) {
        return e.date === [...set][i];
      });
      //console.log(dailyArray);
      for(let i = 0; i < dailyArray.length; i++){

        if(dailyArray[i].income === 'out' ? dailyOut += dailyArray[i].price : dailyOut += 0);

        // 태그 생성
        const history_li = document.createElement('li');
        const his_name = document.createElement('span');
        his_name.classList.add('his_name');
        const his_money = document.createElement('span');
        his_money.classList.add('his_money');

        his_name.textContent = dailyArray[i].history;
    
        if(dailyArray[i].income === 'in'){
          his_money.classList.add('in');
          his_money.textContent = `+ ${priceToString(dailyArray[i].price)}원`;
        }else {
          his_money.classList.add('out');
          his_money.textContent = `${priceToString(dailyArray[i].price)}원`;
        }

        //his_money.textContent = `${priceToString(dailyArray[i].price)}원`;

        history_cont.appendChild(history_li);
        history_li.appendChild(his_name);
        history_li.appendChild(his_money);
      }
      //console.log(dailyOut);
      item_span.textContent = `${priceToString(dailyOut)}원 지출`;

      day_li.appendChild(title_area);
      title_area.appendChild(item_strong);
      title_area.appendChild(item_p);
      item_p.appendChild(item_span);
      dayUl.appendChild(day_li);
      day_li.appendChild(history_cont);
      
      // console.log(day_li);
    }

  }

  //일간그래프
  function dateChart(obj, date){
    const canvas = document.querySelector('#dateChart1');

    // 이번달 구하기
    const thisMonth = date.getMonth() +1 ;
    const thisMonthString = String(thisMonth).padStart(2, '0'); // 이번달 문자형으로 추출
    let dateI = [];

    // console.log(obj.bankList[0].date.substr(8, 2)% 2);
    for(let i = 0; i < obj.bankList.length; i++){
      
      if(obj.bankList[i].date.substr(5, 2) === thisMonthString) {
        if(obj.bankList[i].date.substr(8, 2) % 2 === 1){
          dateI.push(obj.bankList[i].date);
        }
      }
      //console.log(obj.bankList[i].date);
    }
  

    console.log(dateI);
    // 겹치는 날짜 제거
    const set = new Set(dateI);
    console.log(set);
    
    let dailyhis = [];
    let dailyPay = [];
    for(let i = 0; i < [...set].length; i++){
      // 지출
      let dailyOut = 0;
      const dailyArray = obj.bankList.filter(function(e) {
        return e.date === [...set][i];
      });
      for(let i = 0; i < dailyArray.length; i++){
        if(dailyArray[i].income === 'out' ? dailyOut += dailyArray[i].price : dailyOut -= dailyArray[i].price);
      }
      console.log(dailyOut);
      dailyhis.push([...set][i].substr(8, 2));
      dailyPay.push(dailyOut);
    }
    console.log(dailyhis);
    console.log(dailyPay);

    const data = {
      labels:dailyhis,
      datasets: [{
        label: "label1",
        data: dailyPay,
        borderColor: '#38C976',
        backgroundColor: '#38C976',
        order: 1
      }]
    }

    const daychart = new Chart(canvas, {
      type: 'bar',
      data: data,
      options: {
        legend: {
          display: false,
        },
      },
    });

  }


  // 원화 ',' 찍기
  function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});