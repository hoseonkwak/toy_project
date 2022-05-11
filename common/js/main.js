window.addEventListener('DOMContentLoaded', function() {

  //swiper
  new Swiper('.wrap .swiper', {
    autoplay: false,
    loop: false,
  });

  manageOpenClose(1);
  manageOpenClose(2);
  manageOpenClose(3);

  //json 데이터
  const jsonUrl = 'https://raw.githubusercontent.com/hoseonkwak/toy_project/master/bank1.json';
  const jsonUrl2 = 'https://raw.githubusercontent.com/hoseonkwak/toy_project/master/bank2.json';
  const jsonUrl3 = 'https://raw.githubusercontent.com/hoseonkwak/toy_project/master/bank3.json';
  // const jsonUrl = '../bank.json';
  const dataResult = fetch(jsonUrl)
    .then((res) => {
      return res.json();
    })
    .then((obj) => {
      //console.log(obj.bankList[0]);
      const date = new Date();
      main_money(obj, 1);  // 잔고
      progressbar(obj, date, 1); // 계좌 그래프, 남은 금액
      accountHistory(obj, date, 1);  // 계좌내역
      dateChart(obj, date, 1); // 일간 그래프
      outPattern(obj, date, 1);  //지출패턴
      //console.log(obj.bankList);
    });

    const dataResult2 = fetch(jsonUrl2)
    .then((res) => {
      return res.json();
    })
    .then((obj) => {
      //console.log(obj.bankList[0]);
      const date = new Date();
      main_money(obj, 2);  // 잔고
      progressbar(obj, date, 2); // 계좌 그래프, 남은 금액
      accountHistory(obj, date, 2);  // 계좌내역
      dateChart(obj, date, 2); // 일간 그래프
      outPattern(obj, date, 2);  //지출패턴
      //console.log(obj.bankList);
    });

    const dataResult3 = fetch(jsonUrl3)
    .then((res) => {
      return res.json();
    })
    .then((obj) => {
      //console.log(obj.bankList[0]);
      const date = new Date();
      main_money(obj, 3);  // 잔고
      progressbar(obj, date, 3); // 계좌 그래프, 남은 금액
      accountHistory(obj, date, 3);  // 계좌내역
      dateChart(obj, date, 3); // 일간 그래프
      outPattern(obj, date, 3);  //지출패턴
      //console.log(obj.bankList);
    });



  // 잔고
  function main_money(obj, num) {
    let minus = 0;  //지출
    let plus = 0; //수입

    const main_money = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .account_balance_area span`);

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
  // window.addEventListener('resize', () => {
  //   //console.log(winhh);
  //   const mainhh2 = window.outerHeight;
  //   sethh(mainhh2);
  // });
  openHis(1);
  openHis(2);
  openHis(3);

  function manageOpenClose(num){
    // 지출관리 열기
    const openManage = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .account_goal_area .manage_btn`);
    openManage.addEventListener('click', () => {
      document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .manage_wrap`).style.cssText = 'opacity: 1; top: 0';
    });
  
    // 지출관리 닫기버튼
    const manageCloseBtn = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .manage_wrap header.manage_header .close_btn`);
    manageCloseBtn.addEventListener('click', () => {
      document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .manage_wrap`).style.cssText = 'opacity: 0; top: 100%';
    })
  }

  /* 메인화면 높이 조절 및 his open*/
  function openHis(num){    
    const hisBtn = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .account_history .open_btn`);
    hisBtn.addEventListener('click', (e) => {
      const targetNode = e.target.parentNode.parentNode;
      console.log(targetNode.classList.contains('on'));
      if(targetNode.classList.contains('on')){
        targetNode.classList.remove('on');
      }else {
        targetNode.classList.add('on');
      }
    });
  }

  // progressbar
  function progressbar(obj, date, num){
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
    const goalBar = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .account_goal_area .progressbar .goal_bar`);
    const goalStick = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .progressbar .goal_stick`);
    const now_bar = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .progressbar .now_bar`);

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
    //console.log(thisMonthOut);

    //지출관리 이번달 지출
    const monthTotalOut = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .spend_wrap .totalOut_area .totalOut`);
    monthTotalOut.textContent = priceToString(thisMonthOut);

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
    document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .account_goal_area .term`).textContent = remainDate;
    // 사용 가능 금액
    document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .account_goal_area .pay`).textContent = priceToString(limitMoney - thisMonthOut);

    //지출관리
    const manageGoalBar = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .progressbar.manage .goal_bar`);
    const manageGoalStick = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .progressbar.manage .goal_stick`);
    const manageNow_bar = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .progressbar.manage .now_bar`);
    const manageLimit = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .goal_area .title_area span`);

    manageLimit.textContent = priceToString(limitMoney);

    manageNow_bar.style.width = `${nowPer}%`;
    manageGoalStick.style.left = `${thisGoalMoney.toFixed(2)}%`;
    manageGoalBar.style.width = `${thisGoalMoney.toFixed(2)}%`;
  }

  // account_history
  function accountHistory(obj, date, num){
    
    const dayUl = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .account_history_area .day_history`);

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
  function dateChart(obj, date, num){
    const canvas = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) #dateChart1`);

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
  

    //console.log(dateI);
    // 겹치는 날짜 제거
    const set = new Set(dateI);
    //console.log(set);
    
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
      //console.log(dailyOut);
      dailyhis.push([...set][i].substr(8, 2));
      dailyPay.push(dailyOut);
    }
    //console.log(dailyhis);
    //console.log(dailyPay);

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
        responsive: true,
        legend: {
          display: false,
        },
      },
    });

  }

  // 지출 패턴
  function outPattern(obj, date, num){
    const canvas = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) #monthChart1`);

    const thisMonth = date.getMonth() +1;
    const monthSpan = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .manage_wrap .manage_scroll_area .spend_wrap h3 span`);
    //console.log(thisMonth);
    monthSpan.textContent = thisMonth;

    let classifyArr = [];

    // console.log(obj.bankList[0].date.substr(8, 2)% 2);
    for(let i = 0; i < obj.bankList.length; i++){
      if(obj.bankList[i].classify !== '') classifyArr.push(obj.bankList[i].classify);
    }
    //console.log(classifyArr);

    // 겹치는 분류 제거
    const set = new Set(classifyArr);
    //console.log(set);

    
    let patternArr = [];  //패턴 값
    for(let i = 0; i < [...set].length; i++){
      // 패턴별 정리
      let patternValue = 0;
      const pattern = obj.bankList.filter((e) => {
        return e.classify === [...set][i];
      });
      //console.log(pattern);
      for(let i = 0; i < pattern.length; i++){
        patternValue += pattern[i].price;
      }
      //console.log(patternValue);
      patternArr.push(patternValue);
    }
    //console.log(patternArr);

    const data = {
      labels:patternArr,
      datasets: [{
        label: "label1",
        data: patternArr,
        backgroundColor: [
          '#bd5b00',
          '#0057bd',
          '#00bdb2',
          '#fec229',
          '#c4c4c4'
        ],
      }]
    }

    const patternchart = new Chart(canvas, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        legend: {
          display: false,
        },
      },
    });

    //패턴 리스트
    for(let i = 0; i < [...set].length; i++){
      const patternUl = document.querySelector(`.swiper .swiper-slide:nth-child(${num}) .pattern_list`);
      
      const patternLi = document.createElement('li');
      const patternTitleSpan = document.createElement('span');
      patternTitleSpan.classList.add('pattern_title');
      const patternMoneySpan = document.createElement('span');
      patternMoneySpan.classList.add('pattern_money');

      if([...set][i] === 'health'){
        patternTitleSpan.textContent = '건강관리비';
      } else if([...set][i] === 'eatout'){
        patternTitleSpan.textContent = '외식비';
      } else if([...set][i] === 'mart'){
        patternTitleSpan.textContent = '장보기';
      } else if([...set][i] === 'shopping'){
        patternTitleSpan.textContent = '상점';
      } else if([...set][i] === 'oiling'){
        patternTitleSpan.textContent = '주유비';
      }

      patternMoneySpan.textContent = `${priceToString(patternArr[i])}원`;

      //console.log(priceToString(patternArr[i]));
      patternLi.appendChild(patternTitleSpan);
      patternLi.appendChild(patternMoneySpan);
      patternUl.appendChild(patternLi);

    }
  }


  // 원화 ',' 찍기
  function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});